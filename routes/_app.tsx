import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sorites</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="crossOrigin"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        <div
          style={{
            textAlign: "center",
            padding: 10,
            background: "#F6E4E4",
            color: "#C73B3B",
            border: "solid 2px #C73B3B",
            borderLeft: 0,
            borderRight: 0,
          }}
        >
          <b>Read this warning carefully.</b>
          <div>
            This is a beta. It could be buggy. The contracts are not security
            audited. You could lose all your money. Use at your own risk.
          </div>
        </div>
        <Component />
      </body>
    </html>
  );
}
