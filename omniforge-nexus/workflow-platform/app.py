"""
BhartFlow – Voice-first Low-Code / No-Code Workflow Platform
Flask backend integrating with OmniForge Nexus.
Run: python app.py
"""

from flask import Flask, send_from_directory, request, jsonify
import threading
import time
import requests
import smtplib
from email.mime.text import MIMEText
import os
import json
import sqlite3
from typing import Any, Dict
import traceback

try:
    import openai  # optional, for ai_openai node
except ImportError:
    openai = None

import google.generativeai as genai

# ───────────────────────────────────────────────────────────
# App Setup
# ───────────────────────────────────────────────────────────
app = Flask(__name__, static_folder='.', template_folder='.')

# ── AI Configuration ──────────────────────────────────────
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyCCTVUUrzECG4tcta5uIfHwuFb_KLf8IDc")
GEMINI_MODEL = "gemini-2.5-flash"

if GEMINI_API_KEY and GEMINI_API_KEY != "YOUR_GEMINI_API_KEY_HERE":
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        print("✅ Gemini API configured.")
    except Exception as e:
        print(f"❌ Gemini config error: {e}")
        GEMINI_API_KEY = None
else:
    print("⚠️  GEMINI_API_KEY not set. AI features disabled.")
    GEMINI_API_KEY = None

# ── In-memory state ───────────────────────────────────────
workflows: Dict[str, Any] = {"current": {"nodes": [], "edges": []}}
runs: Dict[str, Any] = {}
run_counter = 1
last_cron_run: Dict[str, float] = {}


# ───────────────────────────────────────────────────────────
# Helpers
# ───────────────────────────────────────────────────────────
def log(run_id: str, message: str, extra: dict = None):
    entry = {"ts": time.time(), "message": message, "extra": extra or {}}
    if run_id not in runs:
        runs[run_id] = {"status": "error", "log": []}
    runs[run_id]["log"].append(entry)


def safe_eval_condition(expr: str, env: Dict[str, Any]) -> bool:
    allowed = {
        "True": True, "False": False, "None": None,
        "len": len, "int": int, "float": float, "str": str,
    }
    try:
        return bool(eval(expr, {"__builtins__": allowed}, env))
    except Exception:
        return False


# ───────────────────────────────────────────────────────────
# Routes — Static
# ───────────────────────────────────────────────────────────
@app.route("/")
def index():
    return send_from_directory(".", "nindex.html")


# ───────────────────────────────────────────────────────────
# Routes — Workflow CRUD
# ───────────────────────────────────────────────────────────
@app.route("/api/workflow", methods=["GET", "POST"])
def workflow():
    global workflows
    if request.method == "GET":
        return jsonify(workflows["current"])
    data = request.get_json(force=True)
    workflows["current"] = data
    return jsonify({"status": "ok"})


@app.route("/api/workflow/run", methods=["POST"])
def run_workflow_route():
    wf = workflows.get("current")
    if not wf or not wf.get("nodes"):
        return jsonify({"error": "No workflow defined"}), 400
    run_id = start_run()
    return jsonify({"run_id": run_id})


@app.route("/api/runs/<run_id>", methods=["GET"])
def get_run(run_id):
    run = runs.get(run_id)
    if not run:
        return jsonify({"error": "Run not found"}), 404
    return jsonify(run)


@app.route("/webhook/<node_id>", methods=["GET", "POST"])
def webhook_trigger(node_id):
    wf = workflows.get("current") or {}
    nodes_list = wf.get("nodes", [])
    nodes_dict = {n["id"]: n for n in nodes_list}
    node = nodes_dict.get(node_id)
    if not node or node.get("type") != "webhook":
        return jsonify({"error": "Webhook node not found"}), 404

    payload = {
        "method": request.method,
        "args": request.args.to_dict(),
        "json": None,
        "form": request.form.to_dict(),
    }
    try:
        payload["json"] = request.get_json(silent=True)
    except Exception:
        payload["json"] = None

    run_id = start_run(start_from_node_id=node_id, initial_data=payload)
    return jsonify({"status": "queued", "run_id": run_id})


# ───────────────────────────────────────────────────────────
# Routes — Voice Command
# ───────────────────────────────────────────────────────────
@app.route("/api/voice-command", methods=["POST"])
def voice_command():
    data = request.get_json(force=True)
    command = data.get("command", "").strip()

    if not command:
        return jsonify({"status": "ignored", "message": "Empty command"})

    print(f"🎙️ BhartFlow heard: {command}")

    if not GEMINI_API_KEY:
        return jsonify({
            "status": "error",
            "message": "AI disabled. Configure GEMINI_API_KEY."
        }), 503

    try:
        model = genai.GenerativeModel(GEMINI_MODEL)
        system_context = f"""
You are Mindora, a voice-controlled workflow automation assistant for BhartFlow.
Interpret natural language voice commands and determine the appropriate action.

Voice command: "{command}"

Available actions:
1. CREATE_WORKFLOW - User wants to create a new automation workflow
2. RUN_WORKFLOW - User wants to execute the current workflow
3. CLEAR_WORKFLOW - User wants to clear/delete the workflow
4. SAVE_WORKFLOW - User wants to save the workflow
5. ADD_NODE - User wants to add a specific node
6. HELP - User needs help or information
7. STATUS - User wants to know workflow status
8. UNKNOWN - Cannot determine intent

Respond with ONLY a JSON object:
{{
  "action": "ACTION_NAME",
  "parameters": {{}},
  "message": "Friendly confirmation to speak back to user",
  "workflow_prompt": "If CREATE_WORKFLOW, the natural language prompt to generate workflow"
}}
"""
        response = model.generate_content(system_context)
        response_text = response.text.strip()

        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        response_text = response_text.strip()

        intent_data = json.loads(response_text)
        action = intent_data.get("action", "UNKNOWN")
        message = intent_data.get("message", "Processing your command")

        result = {
            "status": "success",
            "command": command,
            "action": action,
            "message": message,
            "intent": intent_data,
        }

        if action == "CREATE_WORKFLOW":
            result["workflow_prompt"] = intent_data.get("workflow_prompt", command)

        return jsonify(result)

    except json.JSONDecodeError as e:
        return jsonify({"status": "error", "message": "Could not parse AI response", "command": command}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": f"Error: {str(e)}", "command": command}), 500


# ───────────────────────────────────────────────────────────
# Routes — AI Workflow Generation
# ───────────────────────────────────────────────────────────
@app.route("/api/ai/generate-workflow", methods=["POST"])
def generate_workflow():
    data = request.get_json(force=True)
    prompt = data.get("prompt", "")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    if not GEMINI_API_KEY:
        return jsonify({"error": "AI disabled. Configure GEMINI_API_KEY."}), 503

    try:
        model = genai.GenerativeModel(GEMINI_MODEL)
        system_context = f"""
You are a workflow automation assistant for BhartFlow. Given a natural language description,
generate a JSON workflow with nodes and edges that accomplishes the user's goal.

Available node types:
- "start": Manual trigger (config: {{}})
- "cron": Periodic trigger (config: {{"interval": 60, "enabled": true}})
- "webhook": HTTP endpoint trigger (config: {{}})
- "http": HTTP request (config: {{"method": "GET", "url": "", "headers": {{}}, "body": {{}}}})
- "delay": Wait (config: {{"seconds": 5}})
- "log": Log message (config: {{"message": "Log input"}})
- "gmail_send": Send email via SMTP (config: {{"smtp_server": "smtp.gmail.com", "smtp_port": 587, "username": "", "password": "", "to": "", "subject": "", "body": ""}})
- "set": Set fields (config: {{"fields": {{"key": "value"}}}})
- "if": Conditional branch (config: {{"expression": "input.status_code == 200"}})
- "switch": Route by value (config: {{"property": "input.data.type"}})
- "function": Custom Python code (config: {{"code": "result = input_data"}})
- "merge": Merge context keys (config: {{"keys": ["key1"]}})
- "split_in_batches": Split list (config: {{"items_path": "input.items", "batch_size": 10}})
- "file_read": Read file (config: {{"path": "data/input.json", "mode": "text|json"}})
- "file_write": Write file (config: {{"path": "data/output.json", "mode": "text|json"}})
- "db_sqlite": SQLite query (config: {{"db_path": "data/my.db", "query": "SELECT * FROM table", "params": []}})
- "ai_gemini": Gemini AI node (config: {{"prompt": "Summarize this", "input_path": "input.data.text"}})
- "ai_openai": OpenAI node (config: {{"model": "gpt-4o-mini", "prompt": "Summarize this", "input_path": "input.data.text"}})

Response format (JSON only, no markdown):
{{
  "nodes": [
    {{"id": "node-1", "type": "start", "label": "Start", "x": 100, "y": 200, "config": {{}}}},
    {{"id": "node-2", "type": "gmail_send", "label": "Send Email", "x": 350, "y": 200, "config": {{...}}}}
  ],
  "edges": [
    {{"id": "edge-1", "from": "node-1", "to": "node-2"}}
  ]
}}

Rules:
1. Default trigger: "start" unless specified.
2. Extract email details from prompt when relevant.
3. Leave auth fields empty for user to fill.
4. Position nodes: x increases by 250 per step, y centered at 200.
5. Return ONLY valid JSON, no markdown.

User prompt: {prompt}
"""
        response = model.generate_content(system_context)
        workflow_text = response.text.strip()

        if workflow_text.startswith("```"):
            workflow_text = workflow_text.split("```")[1]
            if workflow_text.startswith("json"):
                workflow_text = workflow_text[4:]
        workflow_text = workflow_text.strip()

        workflow_data = json.loads(workflow_text)
        return jsonify(workflow_data)

    except json.JSONDecodeError as e:
        return jsonify({
            "error": "Failed to parse AI response",
            "details": str(e),
            "raw_response": workflow_text if "workflow_text" in locals() else None,
        }), 500
    except Exception as e:
        return jsonify({"error": f"AI generation failed: {str(e)}"}), 500


# ───────────────────────────────────────────────────────────
# Core Execution Engine
# ───────────────────────────────────────────────────────────
def start_run(start_from_node_id=None, initial_data=None):
    global run_counter, runs
    wf = workflows.get("current")
    if not wf or not wf.get("nodes"):
        raise RuntimeError("No workflow defined")

    run_id = str(run_counter)
    run_counter += 1
    runs[run_id] = {"status": "queued", "log": []}

    t = threading.Thread(
        target=execute_workflow,
        args=(run_id, wf, start_from_node_id, initial_data or {}),
    )
    t.daemon = True
    t.start()
    return run_id


def execute_workflow(run_id, wf, start_from_node_id=None, initial_data=None):
    runs[run_id]["status"] = "running"
    try:
        nodes = {n["id"]: n for n in wf.get("nodes", [])}
        edges = wf.get("edges", [])

        if start_from_node_id:
            start_nodes = [nodes[start_from_node_id]] if start_from_node_id in nodes else []
        else:
            start_nodes = [n for n in nodes.values() if n.get("type") == "start"]

        if not start_nodes:
            log(run_id, "No start node found")
            runs[run_id]["status"] = "error"
            return

        context = {}
        for start in start_nodes:
            _execute_from_node(run_id, start, nodes, edges, context, initial_data or {})

        runs[run_id]["status"] = "finished"
        log(run_id, "✅ Workflow completed")
    except Exception as e:
        runs[run_id]["status"] = "error"
        log(run_id, f"❌ Workflow crashed: {repr(e)}")
        log(run_id, "Traceback", {"traceback": traceback.format_exc()})


def _execute_from_node(run_id, node, nodes, edges, context, input_data):
    node_label = node.get("label") or node.get("type")
    log(run_id, f"▶ Executing: {node_label}", {"node_id": node.get("id")})
    output = execute_node_logic(run_id, node, input_data, context)
    for edge in edges:
        if edge.get("from") == node["id"]:
            next_node = nodes.get(edge.get("to"))
            if next_node:
                _execute_from_node(run_id, next_node, nodes, edges, context, output)


def execute_node_logic(run_id, node, input_data, context):
    node_type = node.get("type")
    cfg = node.get("config", {}) or {}

    # Trigger nodes — pass through
    if node_type in ("start", "cron", "webhook"):
        return input_data or {}

    # HTTP Node
    if node_type == "http":
        method = (cfg.get("method") or "GET").upper()
        url = cfg.get("url") or ""
        headers = cfg.get("headers") or {}
        body = cfg.get("body") or {}
        if not url:
            log(run_id, "HTTP node missing URL, skipping")
            return input_data
        try:
            log(run_id, f"🌐 HTTP {method} {url}")
            if method in ("GET", "DELETE"):
                resp = requests.request(method, url, headers=headers, timeout=10)
            else:
                resp = requests.request(method, url, headers=headers, json=body, timeout=10)
            try:
                data = resp.json()
            except Exception:
                data = {"text": resp.text}
            out = {"status_code": resp.status_code, "data": data, "input": input_data}
            log(run_id, f"HTTP {resp.status_code} received", out)
            return out
        except Exception as e:
            log(run_id, f"HTTP request failed: {repr(e)}")
            return {"error": str(e), "input": input_data}

    # Delay Node
    if node_type == "delay":
        try:
            seconds = float(cfg.get("seconds") or 0)
        except ValueError:
            seconds = 0
        log(run_id, f"⏳ Delay {seconds}s")
        time.sleep(max(0, seconds))
        return input_data

    # Log Node
    if node_type == "log":
        msg = cfg.get("message") or "LOG node"
        if "{{ $input" in msg:
            try:
                msg = msg.replace("{{ $input.data }}", json.dumps(input_data))
            except Exception:
                pass
        log(run_id, f"📝 {msg}", {"input": input_data})
        return input_data

    # Gmail Send
    if node_type == "gmail_send":
        smtp_server = cfg.get("smtp_server") or "smtp.gmail.com"
        smtp_port = int(cfg.get("smtp_port") or 587)
        username = cfg.get("username") or ""
        password = cfg.get("password") or ""
        to_addr = cfg.get("to") or ""
        subject = cfg.get("subject") or "Automated Email"
        body = cfg.get("body") or "Hello from BhartFlow!"

        if not (username and password and to_addr):
            log(run_id, "⚠️ Gmail node missing credentials or recipient, skipping")
            return input_data
        try:
            msg = MIMEText(body)
            msg["Subject"] = subject
            msg["From"] = username
            msg["To"] = to_addr
            log(run_id, f"📧 Sending email to {to_addr}")
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(username, password)
                server.send_message(msg)
            log(run_id, "✅ Email sent successfully")
        except Exception as e:
            log(run_id, f"❌ Email failed: {repr(e)}")
        return input_data

    # Set Node
    if node_type == "set":
        fields = cfg.get("fields") or {}
        if not isinstance(input_data, dict):
            input_data = {"value": input_data}
        new_data = dict(input_data)
        new_data.update(fields)
        log(run_id, "⚙️ Set node applied", {"fields": fields})
        return new_data

    # IF Node
    if node_type == "if":
        expr = cfg.get("expression") or ""
        env = {"input": input_data, "context": context}
        result = safe_eval_condition(expr, env)
        log(run_id, f"🔀 IF: {expr} → {result}")
        return {"condition": result, "input": input_data}

    # Switch Node
    if node_type == "switch":
        prop = cfg.get("property") or ""
        env = {"input": input_data, "context": context}
        value = None
        try:
            value = eval(prop, {"__builtins__": {}}, env) if prop else None
        except Exception:
            value = None
        log(run_id, f"🔀 Switch: {prop} = {value}")
        return {"switch_value": value, "input": input_data}

    # Function Node
    if node_type == "function":
        code = cfg.get("code") or "result = input_data"
        local_env = {"input_data": input_data, "context": context, "result": None}
        try:
            exec(code, {"__builtins__": {}}, local_env)
            result = local_env.get("result", input_data)
            log(run_id, "⚡ Function executed")
            return result
        except Exception as e:
            log(run_id, f"❌ Function error: {repr(e)}")
            return input_data

    # Merge Node
    if node_type == "merge":
        keys = cfg.get("keys") or []
        merged = {}
        for k in keys:
            if k in context:
                merged[k] = context[k]
        if isinstance(input_data, dict):
            merged.update(input_data)
        else:
            merged["input"] = input_data
        log(run_id, "🔗 Merge completed", {"keys": keys})
        return merged

    # Split in Batches Node
    if node_type == "split_in_batches":
        items_path = cfg.get("items_path") or "input"
        batch_size = int(cfg.get("batch_size") or 10)
        env = {"input": input_data, "context": context}
        items = []
        try:
            items = eval(items_path, {"__builtins__": {}}, env)
        except Exception:
            items = []
        if not isinstance(items, list):
            items = []
        batches = [items[i:i + batch_size] for i in range(0, len(items), batch_size)]
        log(run_id, f"✂️ Split: {len(items)} items → {len(batches)} batches")
        return {"batches": batches, "batch_size": batch_size, "total_items": len(items)}

    # File Read Node
    if node_type == "file_read":
        path = cfg.get("path") or ""
        mode = cfg.get("mode") or "text"
        if not path:
            log(run_id, "file_read missing path")
            return input_data
        try:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            if mode == "json":
                try:
                    content = json.loads(content)
                except Exception:
                    log(run_id, "file_read JSON parse error")
            log(run_id, f"📂 File read: {path}")
            return {"file_path": path, "content": content}
        except Exception as e:
            log(run_id, f"❌ file_read error: {repr(e)}")
            return input_data

    # File Write Node
    if node_type == "file_write":
        path = cfg.get("path") or ""
        mode = cfg.get("mode") or "text"
        content_path = cfg.get("content_path") or "input"
        if not path:
            log(run_id, "file_write missing path")
            return input_data
        env = {"input": input_data, "context": context}
        try:
            content = eval(content_path, {"__builtins__": {}}, env)
        except Exception:
            content = input_data
        try:
            if mode == "json":
                with open(path, "w", encoding="utf-8") as f:
                    json.dump(content, f, ensure_ascii=False, indent=2)
            else:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(str(content))
            log(run_id, f"💾 File written: {path}")
        except Exception as e:
            log(run_id, f"❌ file_write error: {repr(e)}")
        return input_data

    # SQLite Node
    if node_type == "db_sqlite":
        db_path = cfg.get("db_path") or ""
        query = cfg.get("query") or ""
        params = cfg.get("params") or []
        if not (db_path and query):
            log(run_id, "db_sqlite missing db_path or query")
            return input_data
        try:
            conn = sqlite3.connect(db_path)
            cur = conn.cursor()
            cur.execute(query, params)
            rows = cur.fetchall()
            columns = [desc[0] for desc in cur.description] if cur.description else []
            conn.commit()
            conn.close()
            result_data = {
                "rows": [dict(zip(columns, row)) for row in rows] if columns else rows,
                "columns": columns,
            }
            log(run_id, f"🗄️ SQLite: {len(rows)} rows returned")
            return {"db_result": result_data, "input": input_data}
        except Exception as e:
            log(run_id, f"❌ db_sqlite error: {repr(e)}")
            return input_data

    # AI Gemini Node
    if node_type == "ai_gemini":
        if not GEMINI_API_KEY:
            log(run_id, "ai_gemini: GEMINI_API_KEY not set")
            return input_data
        prompt = cfg.get("prompt") or "Process the input:"
        input_path = cfg.get("input_path") or "input"
        env = {"input": input_data, "context": context}
        try:
            target = eval(input_path, {"__builtins__": {}}, env)
        except Exception:
            target = input_data
        full_prompt = f"{prompt}\n\nINPUT:\n{target}"
        try:
            model = genai.GenerativeModel(GEMINI_MODEL)
            resp = model.generate_content(full_prompt)
            text = (resp.text or "").strip()
            log(run_id, "🤖 Gemini AI response received")
            return {"ai_text": text, "input": input_data}
        except Exception as e:
            log(run_id, f"❌ ai_gemini error: {repr(e)}")
            return input_data

    # AI OpenAI Node
    if node_type == "ai_openai":
        if openai is None or not os.environ.get("OPENAI_API_KEY"):
            log(run_id, "ai_openai: library or OPENAI_API_KEY missing")
            return input_data
        model_name = cfg.get("model") or "gpt-4o-mini"
        prompt = cfg.get("prompt") or "Process the input:"
        input_path = cfg.get("input_path") or "input"
        env = {"input": input_data, "context": context}
        try:
            target = eval(input_path, {"__builtins__": {}}, env)
        except Exception:
            target = input_data
        full_prompt = f"{prompt}\n\nINPUT:\n{target}"
        try:
            client = openai.OpenAI()
            resp = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": "You are a helpful automation assistant."},
                    {"role": "user", "content": full_prompt},
                ],
            )
            text = resp.choices[0].message.content
            log(run_id, "🤖 OpenAI response received")
            return {"ai_text": text, "input": input_data}
        except Exception as e:
            log(run_id, f"❌ ai_openai error: {repr(e)}")
            return input_data

    # Unknown
    log(run_id, f"⚠️ Unknown node type: {node_type}, passing through")
    return input_data


# ───────────────────────────────────────────────────────────
# Cron Scheduler (background thread)
# ───────────────────────────────────────────────────────────
def cron_loop():
    global last_cron_run
    while True:
        try:
            wf = workflows.get("current") or {}
            for node in wf.get("nodes", []):
                if node.get("type") != "cron":
                    continue
                cfg = node.get("config", {}) or {}
                enabled = str(cfg.get("enabled", "true")).lower() in ("true", "1", "yes", "on")
                interval = float(cfg.get("interval") or 0)
                if not enabled or interval <= 0:
                    continue
                now = time.time()
                if now - last_cron_run.get(node["id"], 0) >= interval:
                    last_cron_run[node["id"]] = now
                    start_run(
                        start_from_node_id=node["id"],
                        initial_data={"source": "cron", "timestamp": now},
                    )
        except Exception as e:
            print(f"⚠️  Cron loop error: {e}")
        time.sleep(1)


cron_thread = threading.Thread(target=cron_loop, daemon=True)
cron_thread.start()


# ───────────────────────────────────────────────────────────
# Entry
# ───────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 60)
    print("🚀 BhartFlow – Voice-first Low-Code / No-Code Platform")
    print("=" * 60)
    print("🌐 Open: http://127.0.0.1:5000")
    print("🎙️ Say 'Hey Mindora' to start")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)
