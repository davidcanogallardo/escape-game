Vue.component('invitation', {
    template: //html
    `             
    <div id="overlay" >
        <div class="overlay-content">
            <h3 id="invite-name">Usuario</h3>
            <p>te ha invitado a su partida</p>
            <div class="cancel_confirm">
                <div id="confirm" class="btn accept link" page="main" >
                    <i class="fas fa-check" aria-hidden="true"></i>
                </div>
                <div id="cancel" class="btn cancel link" page="main" >
                    <i class="fas fa-times" aria-hidden="true"></i>
                </div>
            </div>
        </div>
    </div>
    `, 
})

