# ViveCheck

ViveCheck to aplikacja mobilna stworzona przy użyciu React Native i Expo, która pomaga użytkownikom zarządzać listami kontrolnymi i zadaniami.

## Użyte Technologie

*   **React Native:** Framework do tworzenia natywnych aplikacji mobilnych przy użyciu JavaScript i React.
*   **Expo:** Platforma do tworzenia uniwersalnych aplikacji React.
*   **TypeScript:** JavaScript rozszerzony o system typów, który kompiluje się do czystego JavaScriptu.
*   **Jest:** Framework do testowania JavaScriptu.

## Pierwsze Kroki

### Wymagania

*   Node.js
*   Expo CLI

### Instalacja

1.  Sklonuj repozytorium:
    ```bash
    git clone https://github.com/Mniemam/ViveCheck.git
    cd ViveCheck
    ```
2.  Zainstaluj zależności:
    ```bash
    npm install
    ```

### Uruchamianie Aplikacji

1.  Uruchom serwer deweloperski Expo:
    ```bash
    npx expo start --dev-client

    #lub zbudowanie/aplikacja na urządzeniu: 
    npx expo run:android --device
    ```
2.  Postępuj zgodnie z instrukcjami w terminalu, aby uruchomić aplikację na symulatorze lub urządzeniu fizycznym.

## Funkcjonalności

*   Tworzenie i zarządzanie listami kontrolnymi.
*   Wypełnianie zadań w listach kontrolnych.
*   Dodawanie zdjęć do zadań kontrolnych.
*   Pobieranie lokalizacji wykonywanej listy kontrolnej z GPS.
*   Przeglądanie ukończonych list kontrolnych.
*   Generowanie raportu PDF.

## Struktura Projektu

```
.
├── android/
├── app/
│   ├── screens/
│   └── _layout.tsx
├── assets/
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── storage/
│   └── utils/
├── Tests/
├── app.json
├── babel.config.js
├── jest.config.js
└── tsconfig.json
```
