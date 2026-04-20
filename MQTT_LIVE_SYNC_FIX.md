# MQTT Live Data Sync Fix

## Issues Resolved
1.  **Buggy JSON Regex**: Fixed a regex in `EquipmentDetailPage.tsx` that was breaking valid JSON by incorrectly appending commas.
2.  **Payload Structure Mismatch**: The dashboard was expecting a nested structure with headers like `--Monitoring Parameters`, but the old test scripts were sending a flat structure.
3.  **Topic Integration**: Ensure the dashboard subscribes to `Genset/#` and the publisher sends to a matching topic (like `Genset/Data`).
4.  **Instance ID Matching**: The dashboard only updates for specific "Service Soon" IDs (`100661466`, `100677389`, `100678602`).

## How to Verify Live Sync
1.  Open the web application in your browser.
2.  Navigate to the **Equipment Detail Page** for one of the allowed IDs (e.g., `100661466`).
3.  In your terminal, run the new test script:
    ```bash
    python "scripts/test_live_sync.py"
    ```
4.  Observe the data updates in the dashboard (indicated by a green 'MQTT LIVE' dot and blinking indicators on the parameters).

## New Test Script - Key Features
-   Sends data to `Genset/Data`.
-   Uses the correct nested format:
    ```json
    {
      "Gen-ID": "100661466",
      "--Monitoring Parameters": { ... },
      "--Engine Parameters": { ... },
      "--Alternator Parameters": { ... }
    }
    ```
-   Simulates realistic sensor drift for all parameters (Engine Hours, Speed, Voltages, etc.).

## Note on 'Malformed JSON'
We kept the logic for fixing missing commas, but made it more conservative so it doesn't break standard JSON. If your actual device sends data without commas between properties, this logic will automatically insert them before parsing.
