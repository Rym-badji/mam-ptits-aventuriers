function LegalPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Mentions légales & RGPD</h1>

      <div className="card p-4 shadow-sm border-0">
        <h2 className="h4">Éditeur du site</h2>
        <p>M.A.M Des P'tits Aventuriers</p>

        <h2 className="h4 mt-4">Données personnelles</h2>
        <p>
          Les données collectées via le formulaire de contact sont utilisées uniquement
          pour traiter les demandes de pré-inscription et de contact.
        </p>
        <p>
          Les informations ne sont ni revendues ni utilisées à des fins commerciales.
        </p>

        <h2 className="h4 mt-4">Durée de conservation</h2>
        <p>
          Les données sont conservées uniquement pendant la durée nécessaire au traitement
          de la demande.
        </p>

        <h2 className="h4 mt-4">Droits des personnes</h2>
        <p>
          Conformément au RGPD, vous pouvez demander l’accès, la rectification ou la suppression
          de vos données en contactant la MAM.
        </p>

        <h2 className="h4 mt-4">Cookies</h2>
        <p>
          Ce site peut utiliser des cookies techniques nécessaires à son bon fonctionnement.
        </p>
      </div>
    </div>
  );
}

export default LegalPage;