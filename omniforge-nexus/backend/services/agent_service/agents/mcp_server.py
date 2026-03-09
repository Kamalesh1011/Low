"""
OmniForge Nexus – MCP Server (Local Agent Tools)
Bridges the gap between AI agents and the local filesystem for REAL building.
"""
import os
import shutil
import asyncio
from pathlib import Path
import subprocess
import structlog
from typing import Dict, Any, List

logger = structlog.get_logger(__name__)

class NexusMCPServer:
    """
    Implements core tools for local project management. 
    Can be used directly by agents or exposed via a true MCP transport.
    """
    
    def __init__(self, base_dir: str = None):
        # Default to a 'generated_apps' folder in the project root
        if base_dir is None:
            # Default to a 'generated_apps' folder relative to the backend root
            self.base_dir = Path(__file__).parent.parent.parent.parent / "generated_apps"
        else:
            self.base_dir = Path(base_dir)
        
        # Ensure it exists
        self.base_dir.mkdir(parents=True, exist_ok=True)

    async def create_project_scaffold(self, project_name: str, tech_stack: Dict[str, str]) -> Dict[str, Any]:
        """Tool: Set up the initial folder structure for a project."""
        project_slug = project_name.lower().replace(" ", "-")
        project_path = self.base_dir / project_slug
        
        if project_path.exists():
            # In a real workflow, we might skip or reuse, but for builds we overwrite
            # logger.warning("project.exists_overwriting", path=str(project_path))
            # shutil.rmtree(project_path)
            pass
            
        project_path.mkdir(parents=True, exist_ok=True)
        
        # Core Structure
        folders = [
            "backend", "backend/models", "backend/routers", "backend/services", "backend/migrations",
            "frontend", "frontend/src", "frontend/src/pages", "frontend/src/components",
            "docker", "scripts"
        ]
        
        for folder in folders:
            (project_path / folder).mkdir(parents=True, exist_ok=True)
            
        logger.info("project.scaffold_created", project=project_name, path=str(project_path))
        return {"project_path": str(project_path), "status": "created"}

    async def write_project_files(self, project_name: str, files: Dict[str, str]) -> Dict[str, List[str]]:
        """Tool: Write multiple files to a project directory."""
        project_slug = project_name.lower().replace(" ", "-")
        project_path = self.base_dir / project_slug
        
        if not project_path.exists():
            await self.create_project_scaffold(project_name, {})
            
        written = []
        for file_path, content in files.items():
            full_path = project_path / file_path
            
            # Ensure parent directories exist (in case the builder generated paths)
            full_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(full_path, "w", encoding="utf-8") as f:
                f.write(content)
            written.append(file_path)
            
        logger.info("project.files_written", project=project_name, count=len(written))
        return {"status": "success", "files": written}

    async def run_build_commands(self, project_name: str, commands: List[str]) -> Dict[str, Any]:
        """Tool: Execute shell commands in the project directory (e.g., npm install)."""
        project_slug = project_name.lower().replace(" ", "-")
        project_path = self.base_dir / project_slug
        
        outputs = []
        for cmd in commands:
            logger.info("project.running_command", project=project_name, cmd=cmd)
            try:
                # Use shell=True for Windows command compatibility
                process = subprocess.Popen(
                    cmd, 
                    cwd=str(project_path), 
                    shell=True, 
                    stdout=subprocess.PIPE, 
                    stderr=subprocess.PIPE,
                    text=True
                )
                stdout, stderr = process.communicate()
                
                outputs.append({
                    "command": cmd,
                    "exit_code": process.returncode,
                    "stdout": stdout[:1000],  # Truncate large output
                    "stderr": stderr[:1000],
                })
                
                if process.returncode != 0:
                    break # Stop on failure
            except Exception as e:
                outputs.append({"command": cmd, "error": str(e)})
                break
                
        return {"status": "complete", "runs": outputs}

# Singleton Instance
nexus_mcp = NexusMCPServer()
