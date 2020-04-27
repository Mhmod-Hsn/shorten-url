<template>
  <vs-row vs-w="12">
    <div class="vx-col w-full lg:w-1/2 sm:w-2/3 mb-base mx-auto form-card">
      <vx-card class="p-2 p-relative">

        <div class="text-center">
          <div id="loading"></div>
          <h4 v-if="urlObject">
            you're being directed to
            <br/>
            <a :href="urlObject">{{urlObject.originalURL}}</a>
            <br/>
            in {{counter}}s
          </h4>
        </div>
      </vx-card>
    </div>
  </vs-row>
</template>


<script>
    import db from '@/firebase/init'

    export default {
        data(){
            return{
                urlObject: null,
                counter: 5
            }
        },
        props:['id'],
        created() {
            db.collection("URLs")
                .where("uID", "==", this.$route.params.id)
                .get()
                .then(snapshot=> {
                    snapshot.forEach(doc=> {
                        this.urlObject = doc.data()
                        this.urlObject.id = doc.id
                        console.log(this.urlObject)
                    });
                    this.$vs.loading({
                        container: '#loading',
                        type:'point',
                        scale: 1.3
                    })


                    db.collection('URLs').doc(this.urlObject.id).update({
                        used: this.urlObject.used+=1,
                    })
                        .then(()=>{
                        })
                        .catch(err=>{
                            console.log(err)
                        })



                    setInterval(()=>{
                        if (this.counter>0){
                            this.counter--
                        }else{
                            window.location.replace(this.urlObject.originalURL)
                            clearInterval()
                        }
                    },1000)

                })
                .catch(function(error) {
                    console.log("Error getting documents: ", error);
                });

        }
  }
</script>

<style lang="sass">
#loading
  width: 100px
  height: 100px
  position: relative
  display: block
  margin: auto
</style>
