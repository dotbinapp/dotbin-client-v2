function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" aria-label="Cargando página" role="status">
      <div className="size-10 animate-spin rounded-full border-b-2 border-primary-600" />
    </div>
  )
}

export default PageLoader
