<template>
	<div id="count" class="my-4 text-center text-primary">
		<h3 >
			<i class="fal fa-stopwatch-20 mr-2"></i>
			This service has been used {{count}} times
		</h3>
	</div>
</template>

<script>
    import {db} from '@/firebase/init'

    export default {
        name: "Count",
        data() {
            return {
                count: 0
            }
        },
        mounted() {
            this.getCount();
        },
        methods: {
            getCount() {
                db.collection("URLs")
                    .get()
                    .then(snapshot => {
						this.count=snapshot.docs.length;
                    })
                    .catch(function (error) {
                        console.log("Error getting documents: ", error);
                    });
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
