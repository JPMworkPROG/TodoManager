export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Olá Mundo</h1>
      <div className="mt-4 p-4 bg-primary text-primary-foreground rounded">
        <p>Teste de cores do Tailwind - bg-primary</p>
      </div>
      <div className="mt-4 p-4 bg-accent text-accent-foreground rounded">
        <p>Teste de cores do Tailwind - bg-accent</p>
      </div>
    </main>
  );
}

