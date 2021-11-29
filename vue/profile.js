Vue.component('profile', {
    template: //html
    `             
    <div class="profile">
        <h1 id="profile-name">{{user.username}}</h1>
        <div class="container-profile">
            <div class="icon icon-profile">
                <i class="fas fa-user i-profile" aria-hidden="true"></i>
            </div>
            <br>
            <table class="table-profile">
                <tbody><tr>
                    <td class="td-width"><i class="fas fa-trophy i-table" aria-hidden="true"></i> Copas obtenidas</td>
                    <td id="total-trophys" class="center">{{user.numTrophies}}</td>
                </tr>
                <tr>
                    <td class="td-width"><i class="fas fa-star i-table" aria-hidden="true"></i> Mapa favorito</td>
                    <td id="fav-map" class="center">{{user.favMap}}</td>
                </tr>
            </tbody></table>
            
            
        </div>
        <div class="btn blue close-sesion" v-on:click="">Cerrar sesión</div>
        <div class="btn blue link" page="trophy-page" v-on:click="$emit('change-page','trophies')">Ver trofeos</div>
        <div class="btn red volver link" page="main" v-on:click="$emit('change-page','home')">
                Volver
        </div>
    </div>
    `, 
    props: ["user"]
})