/**
 * スマホのライト（トーチ）を制御するクラス
 */
class Light {
    constructor() {
        this.track = null;
        this.status = false; // ライトの点灯状態(false:消灯, true:点灯)
    }

    /**
     * カメラを初期化し、ライト制御の準備を行う
     * @throws {Error} カメラへのアクセスが拒否された場合や、ライトに対応していない場合
     */
    async init() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            this.track = stream.getVideoTracks()[0];

            // ライト（トーチ）機能のサポート確認
            const capabilities = this.track.getCapabilities();
            if (!capabilities.torch) {
                this.track.stop(); // 使えないならストップ
                this.track = null;
                throw new Error("このデバイスはライト制御に対応していません。");
            }
        } catch (err) {
            // エラー処理は呼び出し元に任せるために再スロー
            throw err;
        }
    }

    /**
     * ライトを点灯する
     */
    async turnOn() {
        if (!this.track) return;
        try {
            await this.track.applyConstraints({
                advanced: [{ torch: true }]
            });
            this.status = true;
        } catch (e) {
            console.error("ライトの点灯に失敗しました", e);
        }
    }

    /**
     * ライトを消灯する
     */
    async turnOff() {
        if (!this.track) return;
        try {
            await this.track.applyConstraints({
                advanced: [{ torch: false }]
            });
            this.status = false;
        } catch (e) {
            console.error("ライトの消灯に失敗しました", e);
        }
    }

    /**
     * 点灯・消灯を切り替える
     */
    async toggle() {
        if (this.status) {
            await this.turnOff();
        } else {
            await this.turnOn();
        }
    }

    getLightStatus() {
        return this.status;
    }

    isTrackAvailable() {
        return !!this.track;
    }
}

export default Light;