import {getSessionSoundConf} from "./../../../js/utils.js"

Vue.component('sound-settings', {
    template: //html
    `             
    <div class="sound_settings">
        <h1>{{ $t("soundconfig") }}</h1>

        <div class="all_settings scrollbar">
            <div class="ajuste_sonido">
                <div class="ajuste">
                    <p>{{ $t("generalvol") }}</p>
                    <div class="volumen-range">
                    0 <input id="general-volume" type="range" min="0" max="100" :value="sound.volume" step="10"> 100
                    </div>
                </div>
            </div>
        
            <div class="mic_config">
                <p><u>{{ $t("micconfig") }}</u></p>
                <div class="ajuste">
                    <p for="mic">{{ $t("selectmic") }}</p>
                    <select name="mic" id="mic">
                        <option value="" selected>{{ $t("selectmic1") }}</option>
                        <option value="pimerMic">Micro 1</option>
                        <option value="pimerMic">Micro 1</option>
                        <option value="pimerMic">Micro 1</option>
                    </select>
                </div>
                <div class="ajuste">
                    <p>{{ $t("micvol") }}</p>
                    <div class="volumen-range">
                    0 <input id="mic-volume" type="range" min="0" max="100" :value="sound.micVolume" step="10"> 100
                    </div>
                </div>
                <div class="ajuste">
                    <p>{{ $t("micsens") }}</p>
                    <div class="volumen-range">
                    0 <input id="mic-sensitivity" type="range" min="0" max="100" :value="sound.micSensitivity" step="10"> 100
                    </div>
                </div>
            </div>
        </div>

        <div class="btn red block volver settings-link link" page="settings-page" v-on:click="updateSound();$emit('change-page','settings')">{{ $t("return") }}</div>
        
    </div>
    `, 
    props: ['sound'],
    methods: {
        updateSound() {
            let soundSettings = new SoundSettings($("#general-volume").val(), $("#mic-volume").val(), $("#mic-sensitivity").val())
            // this.$emit('update-sound',soundSettings)
            sessionStorage.setItem("sound-settings", JSON.stringify(soundSettings))
        }
    },
    mounted() {
        this.sound = getSessionSoundConf()
    }
})