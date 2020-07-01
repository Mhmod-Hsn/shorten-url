<template>
	<div class="vx-row" id="urlForm">


		<div class="vx-col md:w-1/1 w-full mt-3">

			<transition-group mode="out-in" name="slide-down">
				<div :key="index" class="vx-row" v-for="(step,index) in steps">
					<div class="vx-col md:w-12/12 w-full mb-3">
						<vs-select
							:name="'step type #'+(index+1)"
							class="w-full"
							label="Step Text"
							v-model="step.type"
							v-validate="'required'"

						>
							<vs-select-item disabled is-selected text="Select type of button" value=""/>
							<vs-select-item :key="index" :text="item.text" :value="item.value" v-for="(item,index) in options"/>
						</vs-select>

						<span class="text-danger text-sm" v-show="errors.has('step type #'+(index+1))">{{errors.first('step type #'+(index+1))}}</span>

					</div>

					<div class="vx-col md:w-12/12 w-full mb-3">
						<vs-input
							:name="'step value #'+(index+1)" class="w-full"
							label="Step URL"
							type="url"
							v-model="step.value"
							v-validate="'required|url:require_protocol'"
						/>
						<span class="text-danger text-sm" v-show="errors.has('step value #'+(index+1))">{{errors.first('step value #'+(index+1))}}</span>

					</div>

					<div class="vx-col md:w-12/12 w-full mb-3">
						<vs-button
							@click="removeStep(index)"
							class="w-full"
							color="danger"
							icon="fa-times-circle" icon-pack="fal" type="flat"
							v-if="index || ( !index && index> 0)"
						>
							Remove this step
						</vs-button>
					</div>
				</div>
			</transition-group>

		</div>
		<div class="vx-col md:w-1/1 w-full mb-3">
			<vs-button
				@click="addStep"
				class="w-full"
				color="success"
				icon="fa-plus"
				icon-pack="fal"
				type="flat"
			>Add step
			</vs-button>
		</div>

		<div class="vx-col md:w-12/12 w-full mb-3">
			<vs-input
				:name="'target URL'"
				class="w-full"
				label="Target URL"
				placeholder="http://....."
				type="url"
				v-model="target"
				v-validate="'required|url:require_protocol'"
			/>
			<span class="text-danger text-sm" v-show="errors.has('target URL')">{{errors.first('target URL')}}</span>

		</div>

		<div class="vx-col md:w-1/1 w-full mb-3">
			<vs-button
				@click="submit"
				class="w-full mt-6 submitButton"
				color="#7367F0"
				gradient-color-secondary="#CE9FFC"
				type="gradient"
			>Create Shorten URL
			</vs-button>
			<vs-button
				@click="copyText($event)"
				class="my-3 mx-auto"
				color="primary"
				icon="icon-calendar"
				icon-pack="feather"
				type="line" v-if="finalResult"
			>{{finalResult}}
			</vs-button>
		</div>
	</div>
</template>

<script>

    import {db} from '@/firebase/init';
    import Vue from 'vue';
    import VeeValidate from 'vee-validate';
    // import {VueReCaptcha} from 'vue-recaptcha-v3'

    Vue.use(VeeValidate);


    // Vue.use(VueReCaptcha, {siteKey: '6LcepKoZAAAAANgG_1SBiAU9e4L-l5WTINaSYlUp'})


    export default {
        name: "create",
        data() {
            return {
                steps: [
                    {
                        type: '',
                        value: ''
                    }
                ],
                options: [
                    {value: "subscribe", text: 'Subscribe'},
                    {value: "subscribe+bell", text: 'Subscribe & Turn on Notifications'},
                    {value: "like", text: 'Like'},
                    {value: "subscribe+like", text: 'Subscribe & Like'},
                    {value: "follow", text: 'Follow'},
                    {value: "follow+bell", text: 'Follow & Turn on Notifications'},
                    {value: "comment", text: 'Comment'},
                    {value: "comment+like", text: 'Comment & Like'},
                    {value: "joindiscord", text: 'Join my Discord'},
                    {value: "viewwebsite", text: 'View my Website'},
                    {value: "dislike", text: 'Dislike'},
                ],
                target: '',
                regex: "",
                error: null,
                finalResult: null
            }
        },
        mounted() {
            let recaptchaScript = document.createElement('script')
            recaptchaScript.setAttribute('src', 'https://www.google.com/recaptcha/api.js')
            recaptchaScript.async = true;
            recaptchaScript.defer = true;
            document.head.appendChild(recaptchaScript)
        },
        methods: {
            addStep() {
                this.steps.push({})
            },
            removeStep(index) {
                this.steps.splice(index, 1);
            },
            copyText(event) {
                const el = document.createElement('textarea');
                el.value = event.target.textContent;
                document.body.appendChild(el);

                el.setSelectionRange(0, 99999); /*For mobile devices*/
                el.select();

                document.execCommand('copy');
                document.body.removeChild(el);

                this.$vs.notify({
                    title: 'Success',
                    text: 'URL Copied to clipboard',
                    color: 'success'
                })
            },
            submit() {
                this.$validator.validateAll().then(result => {
                    if (result) {

                        this.$vs.loading({
                            container: '#urlForm',
                            scale: 0.6
                        })

                        let uID = Math.random().toString(32).slice(2)
                        const shortURL = window.location.href + uID

                        db.collection('URLs').add({
                            originalURL: this.target,
                            steps: this.steps,
                            shortURL,
                            uID,
                            timestamp: Date.now(),
                            used: []
                        })
                            .then(() => {
                                this.$vs.loading.close('#urlForm > .con-vs-loading')
                                this.$vs.notify({
                                    title: 'Success',
                                    text: 'URL has been created successfully',
                                    color: 'success'
                                });
                                this.finalResult = shortURL
                                this.resetSteps();
                            })


                    }
                });
            },
            resetSteps() {
                this.steps = [
                    {
                        type: '',
                        value: ''
                    }
                ]
            }
        }
    }

</script>

<style lang="scss" scoped>

</style>
