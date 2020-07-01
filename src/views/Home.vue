<template>
  <div class="home">
    <vs-row vs-w="12">
      <div class="vx-col w-full lg:w-1/2 sm:w-2/3 mb-base mx-auto form-card w-100 h-100 d-flex align-items-center justify-content-center">
        <vx-card class="p-2 p-relative">
          <CreateSteps/>

          <Count/>
        </vx-card>
      </div>
    </vs-row>
  </div>
</template>

<script>
  import CreateSteps from './steps/create'
  import Count from './steps/Count'
    export default {
      components:{
        CreateSteps,
        Count
      },
      data(){
          return{

          }
      },
      methods:{


      }
  }
</script>

<style lang="scss">
.vx-card{
  &:before{
    content: '';
  }

}
</style>
