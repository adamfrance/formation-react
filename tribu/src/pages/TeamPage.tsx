import Panel from '../components/Panel.tsx'
import TeamPanel from '../components/TeamPanel.tsx'

// L'équipe projet, sur sa propre page
function TeamPage() {
  return (
    <Panel title="Équipe projet">
      <TeamPanel />
    </Panel>
  )
}

export default TeamPage
