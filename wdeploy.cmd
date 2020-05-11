@set ROOT=%~dp0
@set BUILD=%ROOT%build
@call aws s3 sync %BUILD%static/ s3://overlay.rhymu.com/static/
@call aws s3 cp %BUILD%asset-manifest.json s3://overlay.rhymu.com --cache-control max-age=0
@call aws s3 cp %BUILD%index.html s3://overlay.rhymu.com --cache-control max-age=0
