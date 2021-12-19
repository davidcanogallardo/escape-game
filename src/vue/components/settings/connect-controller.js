Vue.component('connect-controller', {
    template: //html
    `             
    <div class="sincronizar_mando">
        <h1>{{ $t("synccontroller") }}</h1>

        <div class="sinc_mand_cont">
            <div class="mandos_sincronizados">
                <p >{{ $t("syncmsg1") }}</p>

            <div class="mando selected">
                <i class="fas fa-gamepad" aria-hidden="true" ></i>
                <span>Mando X</span>
            </div>
            <div class="mando">
                <i class="fas fa-gamepad" aria-hidden="true"></i>
                <span>Mando X</span>
            </div>
            </div>
            <div class="new_mandos">
                <p >{{ $t("syncmsg2") }}</p>
            <div class="nuevos_dispositivos scrollbar">
                <div class="mando">
                    <i class="fas fa-gamepad" aria-hidden="true"></i>
                    <span>Mando X</span>
                </div>
                <div class="mando">
                    <i class="fas fa-gamepad" aria-hidden="true"></i>
                    <span>Mando X</span>
                </div>
                <div class="mando" >
                    <i class="fas fa-gamepad" aria-hidden="true"></i>
                    <span>Mando X</span>
                </div>
                <div class="mando" >
                    <i class="fas fa-gamepad" aria-hidden="true"></i>
                    <span>Mando X</span>
                </div>
        <div class="mando" >
                    <i class="fas fa-gamepad" aria-hidden="true"></i>
                    <span>Mando X</span>
                </div>
        <div class="mando" >
                    <i class="fas fa-gamepad" aria-hidden="true"></i>
                    <span>Mando X</span>
                </div>
        <div class="mando" >
                    <i class="fas fa-gamepad" aria-hidden="true"></i>
                    <span>Mando X</span>
                </div>
        <div class="mando" >
                    <i class="fas fa-gamepad" aria-hidden="true"></i>
                    <span>Mando X</span>
                </div>
        <div class="mando" >
                    <i class="fas fa-gamepad" aria-hidden="true"></i>
                    <span>Mando X</span>
                </div>
        <div class="mando" >
                    <i class="fas fa-gamepad" aria-hidden="true"></i>
                    <span>Mando X</span>
                </div>
        <div class="mando" >
                    <i class="fas fa-gamepad" aria-hidden="true"></i>
                    <span>Mando X</span>
                </div>
        <div class="mando" >
                    <i class="fas fa-gamepad" aria-hidden="true"></i>
                    <span>Mando X</span>
                </div>
        
            </div>
            </div>
        </div>

        <div class="btn red volver settings-link link" page="settings-page" v-on:click="$emit('change-page','settings')">
            {{ $t("return") }}
        </div>
    </div>
    `, 
})