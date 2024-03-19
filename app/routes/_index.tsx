export default function Index() {
  return (
    <div className="flex h-screen w-full flex-col p-6 lg:px-0">
      <div className="flex flex-col max-w-sm">
        <h1 className="text-4xl font-extrabold mb-3 text-primary">Learning about Remix while building Cosmos</h1>
      </div>
      <MainNav />
    </div>
  )
}

export const MainNav = () => {
  return (
    <div className="border border-border p-2 rounded-full absolute bottom-6 max-w-md mx-auto w-full left-0 right-0">
      <div className="text-lg font-medium rounded-full bg-secondary w-fit p-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-secondary-foreground">
          <path opacity="0.14" d="M3 19L12 7L21 19V21H16L12 15L8 21H3V19Z" fill="currentColor" />
          <path d="M15 3L3 19V21H21V19L9 3M12 15L16 21H8L12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
