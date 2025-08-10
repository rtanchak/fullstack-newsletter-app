export const dynamic = 'force-static';

const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>html,body,#swagger{height:100%} body{margin:0}</style>
  </head>
  <body>
    <div id="swagger"></div>
    <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/api/docs/openapi',
        dom_id: '#swagger',
        deepLinking: true
      });
    </script>
  </body>
</html>`;

export async function GET() {
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60' },
  });
}
