import Light from "./light.js";
const light = new Light();
let flashState = false;
let flashDuration = 1000;
let flashInterval = null;

function startInterval() {
    if (flashInterval) clearInterval(flashInterval);
    flashInterval = setInterval(() => {
        console.log("Flash interval tick, state:", flashState);
        if (flashState) {
            light.toggle();
        }
    }, flashDuration);
}

document.addEventListener("DOMContentLoaded", () => {
    const lightBtn = document.getElementById("light_btn");
    const flashDurationInput = document.getElementById("flash_duration");

    // 初期値をセット
    if (flashDurationInput) {
        flashDurationInput.value = flashDuration;
        
        flashDurationInput.addEventListener("change", () => {
            const val = parseInt(flashDurationInput.value, 10);
            if (!isNaN(val) && val >= 10) {
                flashDuration = val;
                startInterval(); // 間隔を更新して再開
            } else {
                flashDurationInput.value = flashDuration;
            }
        });
    }

    lightBtn.addEventListener("change", async () => {
        if (!light.isTrackAvailable()) {
            try {
                await light.init();
            } catch (err) {
                alert("エラー: " + err.message);
                lightBtn.checked = false;
                return;
            }
        }
        
        if (light.isTrackAvailable()) {
            flashState = lightBtn.checked;
            if (!flashState) {
                await light.turnOff();
            }
        } else {
            lightBtn.checked = false;
            await light.turnOff();
            flashState = false;
        }
    });

    startInterval();
});