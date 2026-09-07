from pathlib import Path

from PyInstaller.utils.hooks import collect_submodules

project_root = Path(SPECPATH).parent
frontend = project_root / "frontend"

analysis = Analysis(
    [str(project_root / "backend" / "server.py")],
    pathex=[str(project_root)],
    binaries=[],
    datas=[(str(frontend), "frontend")],
    hiddenimports=collect_submodules("http.server"),
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
)

pyz = PYZ(analysis.pure)

executable = EXE(
    pyz,
    analysis.scripts,
    analysis.binaries,
    analysis.datas,
    [],
    name="Agendado",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
)
