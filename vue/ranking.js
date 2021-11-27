Vue.component('ranking', {
    template: //html
    `             
    <div class="ranking">
        <div class="level-slider">
            <img class="selected" src="./src/images/lvl1.jpg" id="Nivel 1" alt="Nivel 1">
            <img src="./src/images/lvl2.jpg" id="Nivel 2" alt="Nivel 2">
            <img src="./src/images/lvl3.jpg" id="Nivel 3" alt="Nivel 3">
            <img src="./src/images/lvl4.jpg" id="Nivel 4" alt="Nivel 4">
            <img src="./src/images/lvl5.jpg" id="Nivel 5" alt="Nivel 5">
        </div>
        <h3 class="level-name">Level 1</h3>
        <div class="all-levels">
            <div class="ranking-table">
                <table>
                    <thead>
                        <tr>
                            <th>Posición</th>
                            <th class="name">Nombre</th>
                            <th>Tiempo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td class="name">Alex</td>
                            <td>01:20:03</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td class="name">Alex</td>
                            <td>01:20:03</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td class="name">Alex</td>
                            <td>01:20:03</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td class="name">Alex</td>
                            <td>01:20:03</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="btn red volver link" page="main" v-on:click="$emit('change-page','home')">
            Volver
        </div>

    </div>
    `, 
})