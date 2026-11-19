interface TabsProps {
  tabs: string[] // les libellés des onglets
  active: string // l'onglet affiché, décidé par le parent
  onChange: (tab: string) => void
}

// Des onglets « contrôlés » : ils n'ont pas d'état, le parent décide lequel est actif
function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          className="tab"
          aria-selected={tab === active}
          onClick={() => onChange(tab)} // c'est le parent qui change l'onglet actif
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export default Tabs
