// export function validerDonnee(donnees) {
// 	return (req, res, next) => {
// 		const donneesManquantes = donnees.filter((donnee) => !req.body[donnee]);

// 		if (donneesManquantes.length > 0) {
// 			console.error('Champs manquants:', donneesManquantes);
// 			return res.status(400).json({
// 				message: 'Tous les champs sont requis',
// 				missingFields: donneesManquantes,
// 			});
// 		}

// 		next();
// 	};
// }

// MODIFICATION DE MATHEO POUR QUE INITIALISé LES MATCH AVEC COMME SCORE PAR DEFAUT 0-0
export function validerDonnee(champs) {
	return (req, res, next) => {
	  // on regarde uniquement si req.body[nomDuChamp] n'existe pas du tout
	  const donneesManquantes = champs.filter(
		champ => req.body[champ] === undefined || req.body[champ] === null
	  );
  
	  if (donneesManquantes.length > 0) {
		console.error('Champs manquants:', donneesManquantes);
		return res.status(400).json({
		  message: 'Tous les champs sont requis',
		  missingFields: donneesManquantes
		});
	  }
  
	  next();
	};
  }
  