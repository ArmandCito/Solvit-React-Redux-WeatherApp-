# README_REDUX.md

# Apprendre Redux et Redux Toolkit avec le projet SolvitCast

> Objectif : comprendre **pourquoi Redux existe**, **à quel problème il répond**, et **comment Redux Toolkit simplifie énormément Redux** dans un projet React + TypeScript + Vite comme **SolvitCast**.

---

# Pourquoi parler de Redux dans SolvitCast ?

Dans SolvitCast, plusieurs composants utilisent les mêmes données météo.

Structure actuelle :

* `Navbar`
* `CityResults`
* `ForeCastSection`
* `WeatherDetails`
* `Footer`

Imaginons qu’un utilisateur recherche **Kigali**.

Les données météo doivent être affichées dans plusieurs composants :

| Composant       | Données utilisées                  |
| --------------- | ---------------------------------- |
| Navbar          | nom de la ville                    |
| CityResults     | température, météo principale      |
| ForeCastSection | prévisions                         |
| WeatherDetails  | humidité, vent, pression           |
| Footer          | éventuellement la ville ou l’heure |

Le problème est simple :

**Une seule recherche doit mettre à jour plusieurs composants en même temps.**

---

# Sans Redux : comment React gère cela ?

En React classique, les données sont souvent stockées dans le composant parent.

Exemple :

```tsx
function Home() {
  const [weather, setWeather] = useState(null);

  return (
    <>
      <Navbar />
      <CityResults weather={weather} />
      <ForeCastSection weather={weather} />
      <WeatherDetails weather={weather} />
      <Footer />
    </>
  );
}
```

Ici `Home` possède l’état (`weather`).

Il doit le transmettre à chaque composant via des **props**.

---

# Le problème du Prop Drilling

Imaginons maintenant que `WeatherDetails` soit imbriqué plus profondément.

```text
Home
│
├── MainLayout
│     │
│     ├── WeatherContainer
│     │      │
│     │      └── WeatherDetails
```

Tu es obligé de faire :

```tsx
<Home weather={weather}>
   <MainLayout weather={weather}>
      <WeatherContainer weather={weather}>
         <WeatherDetails weather={weather}/>
      </WeatherContainer>
   </MainLayout>
</Home>
```

Le composant `MainLayout` n’utilise même pas `weather`.

Il le transmet juste au composant suivant.

C’est ce qu’on appelle **le Prop Drilling**.

---

# Les limites sans Redux

Plus le projet grandit, plus tu obtiens :

* beaucoup de props
* beaucoup de `useState`
* beaucoup de `useEffect`
* beaucoup de composants intermédiaires

Exemple :

```tsx
<Home
  weather={weather}
  forecast={forecast}
  loading={loading}
  error={error}
  unit={unit}
  city={city}
/>
```

Puis chaque composant reçoit :

```tsx
<WeatherDetails
  weather={weather}
  unit={unit}
  loading={loading}
/>
```

Cela devient difficile à maintenir.

---

# Redux : l’idée principale

Redux crée **un stockage central**.

On l’appelle le **Store**.

Au lieu que `Home` garde les données :

```text
Home
│
├── weather
├── forecast
├── city
└── loading
```

On obtient :

```text
Redux Store
│
├── weather
├── forecast
├── city
├── loading
└── error
```

Tous les composants peuvent accéder directement au Store.

---

# Schéma de fonctionnement

Sans Redux :

```text
API
 │
 ▼
Home
 │
 ├── CityResults
 ├── Forecast
 └── WeatherDetails
```

Avec Redux :

```text
             API
              │
              ▼
         Redux Store
        /     |      \
       /      |       \
Navbar   CityResults  WeatherDetails
                |
          ForecastSection
```

Les composants ne dépendent plus du parent.

Ils dépendent du Store.

---

# Comparaison : sans Redux

```tsx
function Home() {
  const [city, setCity] = useState('Kigali');

  return (
    <>
      <Navbar city={city}/>
      <CityResults city={city}/>
      <Footer city={city}/>
    </>
  );
}
```

Chaque composant reçoit la ville.

---

# Comparaison : avec Redux

Navbar :

```tsx
const city = useSelector(state => state.weather.city);
```

CityResults :

```tsx
const city = useSelector(state => state.weather.city);
```

Footer :

```tsx
const city = useSelector(state => state.weather.city);
```

Aucune prop n’est nécessaire.

---

# Le Store

Le Store est simplement un objet JavaScript.

Exemple :

```ts
{
  weather: {
    city: 'Kigali',
    temperature: 22,
    humidity: 80,
    wind: 3.5
  }
}
```

Tous les composants lisent cette même source de vérité.

On parle de **Single Source of Truth**.

---

# Les Actions

Une **action** décrit ce qui s’est passé.

Exemple :

```ts
{
  type: 'weather/setCity',
  payload: 'Paris'
}
```

Traduction :

> « La ville devient Paris ».

L’action ne modifie pas les données.

Elle décrit simplement l’événement.

---

# Les Reducers

Le reducer reçoit :

* l’état actuel
* une action

Puis retourne un nouvel état.

Exemple :

```ts
function weatherReducer(state, action) {
  switch(action.type) {
    case 'weather/setCity':
      return {
        ...state,
        city: action.payload
      };
    default:
      return state;
  }
}
```

C’est lui qui modifie l’état.

---

# Flux Redux

```text
Utilisateur
      │
      ▼
Clique sur Rechercher
      │
      ▼
Dispatch(action)
      │
      ▼
Reducer
      │
      ▼
Store mis à jour
      │
      ▼
Tous les composants concernés se re-rendent automatiquement
```

---

# Pourquoi Redux Toolkit ?

Le Redux historique est très verbeux.

Exemple ancien :

### Types

```ts
const SET_CITY = 'SET_CITY';
```

### Action

```ts
function setCity(city) {
  return {
    type: SET_CITY,
    payload: city
  };
}
```

### Reducer

```ts
function reducer(state, action) {
  ...
}
```

### Store

```ts
const store = createStore(reducer);
```

Beaucoup de fichiers.

Beaucoup de répétition.

Redux Toolkit (RTK) a été créé pour supprimer cette complexité.

---

# Redux Toolkit : createSlice

Avec RTK :

```ts
const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    city: 'Kigali'
  },
  reducers: {
    setCity(state, action) {
      state.city = action.payload;
    }
  }
});
```

Tout est généré automatiquement.

RTK crée :

* les actions
* les reducers
* les types internes

En quelques lignes.

---

# Exemple complet adapté à SolvitCast

## weatherSlice.ts

```ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  city: 'Kigali',
  temperature: 22,
  humidity: 80,
  wind: 3.5
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeather(state, action) {
      state.city = action.payload.city;
      state.temperature = action.payload.temperature;
      state.humidity = action.payload.humidity;
      state.wind = action.payload.wind;
    }
  }
});

export const { setWeather } = weatherSlice.actions;

export default weatherSlice.reducer;
```

---

# Création du Store

```ts
import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer
  }
});
```

`configureStore()` remplace plusieurs configurations compliquées de Redux classique.

---

# Fournir le Store à React

Dans `main.tsx` :

```tsx
import { Provider } from 'react-redux';

<Provider store={store}>
  <App />
</Provider>
```

Maintenant tous les composants peuvent accéder au Store.

---

# Lire une donnée

Dans `WeatherDetails.tsx` :

```tsx
import { useSelector } from 'react-redux';

const humidity = useSelector(
  state => state.weather.humidity
);
```

Le composant est automatiquement mis à jour lorsque l’humidité change.

---

# Modifier une donnée

Dans `Navbar.tsx` :

```tsx
import { useDispatch } from 'react-redux';
import { setWeather } from './weatherSlice';

const dispatch = useDispatch();

dispatch(
  setWeather({
    city: 'Paris',
    temperature: 19,
    humidity: 60,
    wind: 5
  })
);
```

Une seule instruction met à jour toute l’application.

---

# Ce qui se passerait dans SolvitCast

Sans Redux :

```text
Recherche
   │
   ▼
Home
 │
 ├── Navbar
 ├── CityResults
 ├── Forecast
 └── WeatherDetails
```

Avec Redux :

```text
Recherche
   │
   ▼
dispatch(setWeather)
   │
   ▼
Store
 │
 ├── Navbar (mis à jour)
 ├── CityResults (mis à jour)
 ├── Forecast (mis à jour)
 └── WeatherDetails (mis à jour)
```

Aucun composant parent n’a besoin de transmettre les données.

---

# Gestion du chargement (loading)

Sans Redux :

```tsx
const [loading, setLoading] = useState(false);
```

Puis transmettre `loading` partout.

Avec Redux :

```ts
{
  loading: true
}
```

Tous les composants peuvent afficher :

```tsx
const loading = useSelector(
  state => state.weather.loading
);
```

Exemple :

* Navbar affiche un spinner
* CityResults affiche « Chargement… »
* Forecast affiche des skeleton cards

Le tout synchronisé.

---

# Gestion des erreurs

Le Store peut contenir :

```ts
{
  error: 'Ville introuvable'
}
```

N’importe quel composant peut afficher :

```tsx
const error = useSelector(
  state => state.weather.error
);
```

Pas besoin de prop `error`.

---

# Changement Celsius / Fahrenheit

Imaginons un bouton.

Sans Redux :

Le bouton doit prévenir le parent.

Le parent modifie l’unité.

Le parent retransmet la nouvelle unité.

Avec Redux :

```ts
{
  unit: 'metric'
}
```

Le bouton :

```tsx
dispatch(setUnit('imperial'));
```

Tous les composants utilisent automatiquement la nouvelle unité.

---

# Exemple très parlant

Imagine une maison.

Sans Redux :

Chaque pièce possède son propre frigo.

```text
Cuisine : lait
Salon : lait
Chambre : lait
Bureau : lait
```

Quand le lait change, il faut modifier tous les frigos.

Avec Redux :

Un seul frigo central.

```text
Frigo central
     │
     ├── Cuisine
     ├── Salon
     ├── Chambre
     └── Bureau
```

Tout le monde lit la même information.

Redux = **le frigo central de l’application**.

---

# Et Redux Toolkit Query (RTK Query) ?

RTK possède aussi **RTK Query**, très utile pour SolvitCast.

Aujourd’hui :

```tsx
useEffect(() => {
  fetch(...)
}, []);
```

Avec RTK Query :

```tsx
const { data, error, isLoading } =
  useGetWeatherQuery('Kigali');
```

RTK Query gère automatiquement :

* les requêtes HTTP
* le cache
* les erreurs
* le loading
* les re-fetch
* l’invalidation des données

Pour une application météo, c’est extrêmement puissant.

---

# Avantages concrets pour SolvitCast

| Sans Redux                | Avec Redux Toolkit                |
| ------------------------- | --------------------------------- |
| Beaucoup de props         | Aucune prop inutile               |
| Prop drilling             | Accès direct au Store             |
| useState dispersés        | État centralisé                   |
| Synchronisation difficile | Synchronisation automatique       |
| Code répétitif            | createSlice simplifie tout        |
| Configuration longue      | configureStore en quelques lignes |
| Gestion API manuelle      | RTK Query peut automatiser        |

---

# Quand utiliser Redux ?

Redux n’est **pas obligatoire**.

Pour une petite application de 3 composants :

* useState
* useContext

suffisent souvent.

Redux devient intéressant lorsque :

* plusieurs composants utilisent les mêmes données
* plusieurs pages partagent un état
* les données proviennent d’API
* il existe du loading, des erreurs, du cache
* l’application grandit

SolvitCast est justement un excellent projet pour apprendre Redux car :

* une recherche met à jour plusieurs composants
* les données viennent d’une API
* il existe loading, erreurs, unités, ville, prévisions

---

# La progression que je te recommande

1. Maîtriser `useState`
2. Comprendre `props`
3. Comprendre le **prop drilling**
4. Comprendre le besoin d’un **Store global**
5. Apprendre **Redux Toolkit**
6. Ajouter **RTK Query**

C’est exactement l’ordre utilisé par la plupart des développeurs React professionnels.

---

# Conclusion

Redux est une **bibliothèque de gestion d’état global**.

Redux Toolkit est la **version moderne et officielle de Redux**, beaucoup plus simple à utiliser.

Dans SolvitCast, Redux Toolkit permettrait de :

* centraliser les données météo,
* éviter le prop drilling,
* synchroniser automatiquement tous les composants,
* gérer facilement le chargement et les erreurs,
* préparer l’application à devenir plus grande (historique des recherches, favoris, géolocalisation, thèmes, unités, cache API, etc.).

Si tu maîtrises Redux Toolkit après ce projet, tu comprendras une compétence très recherchée dans les projets React professionnels, notamment avec **React + TypeScript + Vite**, **Next.js**, ou les applications de grande taille utilisant des API complexes.
