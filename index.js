module.exports = function pet_skill(mod) {
	const path = require('path');
	mod.dispatch.addDefinition('C_PET_SKILL', 2, path.join(__dirname, 'C_PET_SKILL.2.def'));
	let packet_pet
	let pet_timeout = null
	let enabled = true
	let cid
	let pet_gameId


	mod.command.add("pet", () => {
		enabled = !enabled
		mod.command.message("Auto pet skill use mod : " + enabled);
	})	

    mod.hook('S_LOGIN', 14, event => {
		clearTimeout(pet_timeout)
		pet_timeout = null
		cid = event.gameId
	})
    mod.hook('S_RETURN_TO_LOBBY', 1, event => {
		clearTimeout(pet_timeout)
		pet_timeout = null
	})	
    mod.hook('S_REQUEST_SPAWN_SERVANT', 4, event => {
		if(event.ownerId==cid) {
			pet_gameId = event.gameId
			if(pet_timeout!=null) {
				packet_pet.gameId = pet_gameId
				clearTimeout(pet_timeout)
				pet_timeout = null
				pet_timeout = setTimeout(function () {
						packet_pet.unk1++
						mod.send('C_PET_SKILL', 2, packet_pet)
					}, 10000)
			}				
			
		}
	})		

    mod.hook('C_PET_SKILL', 2, { order: 999999, filter: { fake: null } }, event => {
		if(!enabled) return
		packet_pet = event
		pet_timeout = setTimeout(function () {
				packet_pet.unk1++
				mod.send('C_PET_SKILL', 2, packet_pet)
			}, 10000)
		return true
	})	
}