import os from "node:os";

export async function ServerComponent() {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  return (
    <div>
      <h1>Server Component</h1>
      <p>OS: {os.platform()}</p>
    </div>
  );
}
