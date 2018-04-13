var person = {
	name: 'Karan',
	age: 21
}

function updatePerson(obj) {
	// obj = {
	// 	name: 'Karan',
	// 	age: 28
	// }
	obj.age = 28
}
console.log(person)
updatePerson(person)
console.log(person)

var gradeArray = [66, 93]
function addGrade(arr) {
	//arr.push(99)
	arr = [12, 33, 99]
	debugger
}

addGrade(gradeArray)
console.log(gradeArray)
