<template>
  <div class="home">
    <vs-row vs-w="12">
      <div class="vx-col w-full lg:w-1/2 sm:w-2/3 mb-base mx-auto form-card">
        <vx-card class="p-2 p-relative" id="urlForm">
          <div class="text-center">
            <h4>Enter your link to shorten it: </h4>
          </div>
          <div class="flex justify-between text-center">
            <div class="w-full">
              <vs-input
                size="large"
                v-model="url"
                class="mt-5 w-full"
                danger-text="The URL is not valid"
                :danger="error!==null?true:false"

              />
              <span class="text-danger text-sm" v-if="error">{{error}}</span>
            </div>

          </div>
          <vs-button type="gradient" class="w-full mt-6 submitButton" color="#7367F0" gradient-color-secondary="#CE9FFC" @click="submit">Create Shorten URL</vs-button>
          <vs-button
            color="primary"
            type="line"
            class="my-3 w-full"
            v-if="finalResult"
            @click="copyText($event)"
            icon-pack="feather" icon="icon-calendar"
          >{{finalResult}}</vs-button>
        </vx-card>
      </div>
    </vs-row>
  </div>
</template>

<script>
    import {db} from '@/firebase/init'

    export default {
      data(){
          return{
              url: '',
              regex: "",
              error: null,
              finalResult:null
          }
      },
      methods:{
          copyText(event){
              const el = document.createElement('textarea');
              el.value = event.target.textContent;
              document.body.appendChild(el);

              el.setSelectionRange(0, 99999); /*For mobile devices*/
              el.select();

              document.execCommand('copy');
              document.body.removeChild(el);

              this.$vs.notify({
                  title:'Success',
                  text:'URL Copied to clipboard',
                  color:'success'})
          },
          validURL(str) {
              var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
              return !!pattern.test(str);
          },
          submit(){
              if (this.validURL(this.url)){
                  this.$vs.loading({
                      container: '#urlForm',
                      scale: 0.6
                  })

                  let uID = Math.random().toString(32).slice(2)
                  const shortURL = window.location.href+uID
                  db.collection('URLs').add({
                      originalURL: this.url,
                      shortURL,
                      uID,
                      timestamp: Date.now(),
                      used: []
                  })
                      .then(()=>{
                          this.$vs.loading.close('#urlForm > .con-vs-loading')
                          this.$vs.notify({
                              title:'Success',
                              text:'URL has been created successfully',
                              color:'success'})

                          this.finalResult=shortURL
                      })







                  this.error=null
              }else {
                  this.error='Enter Valid URL'
              }
          }

      }
  }
</script>

<style lang="sass">
  .form-card
    margin-top: 200px

</style>
