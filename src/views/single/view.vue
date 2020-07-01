<template>
	<vs-row vs-w="12" >
		<div class="vx-col w-full lg:w-1/2 sm:w-2/3 mb-base mx-auto form-card">
			<vx-card class="p-2 p-relative">

				<h3>
					<i class="far fa-lock-alt mr-2"></i>
					Complete the steps to proceed
				</h3>
				<p class="mt-3">To access the target site you will need to quickly complete the steps below.</p>

				<vs-list>
					<vs-list-item
						:key="step.uID"
						:title="step.type"
						v-for="(step,index) in urlObject.steps"
						v-if="urlObject.steps">
						<template slot="avatar">
							<i :class="getIcon(step.type)" class="fa-2x mr-3"></i>
						</template>

						<vs-button :color="step.done?'success':'warning'" :disabled="step.done" @click="pressStep(index)">
							<i class="far fa-check" v-if="step.done"></i>
							<i class="far fa-arrow-right" v-else></i>
						</vs-button>

					</vs-list-item>

				</vs-list>


				<div class="vs-row">
					<div class="vx-col md:w-1/1 w-full mb-3">
						<vs-button
							:href="urlObject.originalURL"
							v-if="isCompleted"
							class="w-full mt-6 submitButton"
						>Continue to your url
						</vs-button>
					</div>
				</div>
			</vx-card>
		</div>
	</vs-row>
</template>


<script>
    import {db, fb} from '@/firebase/init'


    export default {
        data() {
            return {
                urlObject: {},
                icons: [
                    {
                        value: 'subscribe',
                        icon: 'fab fa-youtube'
                    },
                    {
                        value: 'subscribe+bell',
                        icon: 'fal fa-bell'
                    },
                    {
                        value: 'like',
                        icon: 'fal fa-thumbs-up'
                    },
                    {
                        value: 'subscribe+like',
                        icon: 'fal fa-heart'
                    },
                    {
                        value: 'follow',
                        icon: 'fal fa-user-plus'
                    },
                    {
                        value: 'follow+bell',
                        icon: 'fal fa-bell-on'
                    },
                    {
                        value: 'comment',
                        icon: 'fal fa-comments'
                    },
                    {
                        value: 'comment+like',
                        icon: 'fal fa-comment-medical'
                    },
                    {
                        value: 'joindiscord',
                        icon: 'fab fa-discord'
                    },
                ],
                steps: []
            }
        },
        props: ['id'],
        computed: {
            isCompleted(){
                if (this.urlObject.steps){
                    return this.urlObject.steps.every(step => step.done === true);
                }
            }
        },
        created() {

            db.collection("URLs")
                .where("uID", "==", this.$route.params.id)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        this.urlObject = doc.data();
                        this.urlObject.id = doc.id;
                    });


                    db.collection('URLs').doc(this.urlObject.id).update({used: fb.firestore.FieldValue.arrayUnion(Date.now())})
                        .then(() => {
                        })
                        .catch(err => {
                            console.log(err)
                        })


                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });

        },
        methods: {
            pressStep(index) {
                window.open(this.urlObject.steps[index].value, '_blank');
                this.$set(this.urlObject.steps[index], 'done', true)
            },
            getIcon(value) {
                for (let i = 0; i < this.icons.length; i++) {
                    if (this.icons[i].value === value) {
                        return this.icons[i].icon
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
	#loading {
		width: 100px;
		height: 100px;
		position: relative;
		display: block;
		margin: auto;
	}

	.vs-list--item .vs-list--avatar{
		width: 60px;
	}
</style>
