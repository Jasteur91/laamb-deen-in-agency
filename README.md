# LAAMB — De l’arène nationale à la scène mondiale

Site de présentation Deen In Agency pour la Fédération de lutte : film, présentation animée, motion vertical et dossier PDF.
Site statique (aucune étape de build) : `index.html` à la racine, présentation animée dans `presentation/`.

## Mise en ligne

Le site est servi par Vercel : https://laamb-deen-in-agency.vercel.app

Le projet Vercel ne contient qu'une petite fonction (`deploy/vercel-proxy/`) qui sert les fichiers de ce dépôt public,
épinglés sur un commit précis, avec les bons types (vidéo, PDF, images). Après une modification du site :
pousser sur `main`, puis redéployer la fonction avec le nouveau hash de commit dans `ORIGIN`.

Si le compte Vercel est un jour relié à GitHub, on peut aussi importer ce dépôt directement dans Vercel
(Framework : Other, sans build) : le site statique fonctionne tel quel.
