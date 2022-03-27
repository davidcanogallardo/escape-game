Vue.component("profile-photo", {
    //html
    template: `             
      <div :class="'icon bg-'+photo.iconBG">
            <i :class="'fas fa-'+photo.icon+' color-'+photo.iconColor" aria-hidden="true"></i>
            <i v-if="page == 'profile'" class="fas fa-edit edit-icon" aria-hidden="true"></i>
            <slot>
            </slot>
      </div>
      `,
      // TODO 
    props: ["photo"],
  });