export default function Help() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Help</h1>
      <p className="text-lg">This is the Help page.</p>
      <p className="bg-test-pink text-white p-4">
      Tailwind config is working!
     </p>
     <Diagnostic />
    </div>
  );
}

function Diagnostic() {
  return (
  <div className="prose dark:prose-invert p-4 bg-test-pink rounded-xl my-10">
  <h1>Tailwind + Typography Diagnostic 🛠️</h1>
  
  <p><strong>If you see:</strong></p>
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
        <td><strong>Bc4</strong></td>
        <td>Develops quickly, targets f7 🎯</td>
        <td>Exposes bishop to counterattack</td>
      </tr>
      <tr>
        <td><strong>d4</strong></td>
        <td>Opens center</td>
        <td>May overextend</td>
      </tr>
    </tbody>
  </table>

  <p className="mt-6">✅ If you see all this looking nice: you're good to go!</p>
</div>
  )}