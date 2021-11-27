Vue.component('sound-settings', {
    template: //html
    `             
    <div class="sound_settings">
        <h1>Configuración de Sonido</h1>

        <div class="all_settings scrollbar">
            <div class="ajuste_sonido">
                <div class="ajuste">
                    <p>Volumen General</p>
                    <div class="volumen-range">
                    0 <input type="range" min="0" max="100" value="50" step="10"> 100
                    </div>
                </div>
            </div>
        
            <div class="mic_config">
                <p><u>Configuración de Micrófono</u></p>
                <div class="ajuste">
                    <p for="mic">Selecciona un Micrófono</p>
                    <select name="mic" id="mic">
                        <option value="" selected>Seleccionar Micrófono</option>
                        <option value="pimerMic">Micro 1</option>
                        <option value="pimerMic">Micro 1</option>
                        <option value="pimerMic">Micro 1</option>
                    </select>
                </div>
                <div class="ajuste">
                    <p>Volumen Micrófono</p>
                    <div class="volumen-range">
                    0 <input type="range" min="0" max="100" value="50" step="10"> 100
                    </div>
                </div>
                <div class="ajuste">
                    <p>Sensibilidad Micrófono</p>
                    <div class="volumen-range">
                    0 <input type="range" min="0" max="100" value="50" step="10"> 100
                    </div>
                </div>
            </div>
        </div>

        <div class="btn red block volver settings-link link" page="settings-page" v-on:click="$emit('change-page','settings')">Volver</div>
        
    </div>
    `, 
})