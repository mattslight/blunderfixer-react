export default function Help() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Help</h1>
      <p className="text-lg">This is the Help page.</p>
      <p className="bg-test-pink p-4 text-white">Tailwind config is working!</p>
      <Diagnostic />
    </div>
  );
}

function Diagnostic() {
  return (
    <div className="prose dark:prose-invert bg-test-pink my-10 rounded-xl p-4">
      <h1>Tailwind + Typography Diagnostic 🛠️</h1>

      <p>
        <strong>If you see:</strong>
      </p>
      <ul>
        <li>Background is bright pink ➔ Tailwind config loaded ✅</li>
        <li>Text styled nicely ➔ Typography plugin active ✅</li>
        <li>Table with borders ➔ Markdown tables rendering ✅</li>
      </ul>

      <h2>Example Table</h2>
      <table>
        <thead>
          <tr>
            <th>Move</th>
            <th>Pros</th>
            <th>Cons</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Bc4</strong>
            </td>
            <td>Develops quickly, targets f7 🎯</td>
            <td>Exposes bishop to counterattack</td>
          </tr>
          <tr>
            <td>
              <strong>d4</strong>
            </td>
            <td>Opens center</td>
            <td>May overextend</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-6">
        ✅ If you see all this looking nice: you&apos;re good to go!
      </p>
    </div>
  );
}
