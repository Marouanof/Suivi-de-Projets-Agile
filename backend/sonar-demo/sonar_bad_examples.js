// Fichier de démonstration pour SonarQube : contient volontairement des code smells / vulnérabilités.
// N'EST PAS UTILISÉ PAR L'APPLICATION (ne pas importer).

// SQL injection + concaténation non paramétrée
function insecureUserLookup(req) {
  const query = "SELECT * FROM users WHERE email = '" + req.query.email + "'"; // Noncompliant
  console.log(query);
  return query;
}

// Usage d'eval
function doEval(input) {
  return eval(input); // Noncompliant
}

// Fonction trop complexe (branches + longueur)
function overlyComplex(status, payload) {
  let result = 0;
  if (status === 'A') result += 1;
  if (status === 'B') result += 2;
  if (status === 'C') result += 3;
  if (status === 'D') result += 4;
  if (status === 'E') result += 5;
  if (status === 'F') result += 6;
  if (status === 'G') result += 7;
  if (status === 'H') result += 8;
  if (status === 'I') result += 9;
  if (status === 'J') result += 10;
  if (status === 'K') result += 11;
  if (status === 'L') result += 12;
  if (status === 'M') result += 13;
  if (status === 'N') result += 14;
  if (status === 'O') result += 15;
  if (status === 'P') result += 16;
  if (status === 'Q') result += 17;
  if (status === 'R') result += 18;
  if (status === 'S') result += 19;
  if (status === 'T') result += 20;
  if (status === 'U') result += 21;
  if (status === 'V') result += 22;
  if (status === 'W') result += 23;
  if (status === 'X') result += 24;
  if (status === 'Y') result += 25;
  if (status === 'Z') result += 26;

  // duplication volontaire
  if (payload && payload.flag) {
    if (payload.flag === 'foo') result += 1;
    if (payload.flag === 'bar') result += 2;
  }
  if (payload && payload.flag) {
    if (payload.flag === 'foo') result += 1;
    if (payload.flag === 'bar') result += 2;
  }

  try {
    doSomething();
  } catch (e) {
    // catch vide : swallow error
  }

  return result;
}

// TODO non résolu
function todoExample() {
  // TODO: à implémenter
  const unused = 42; // unused variable
  return null;
}

module.exports = {
  insecureUserLookup,
  doEval,
  overlyComplex,
  todoExample,
};
