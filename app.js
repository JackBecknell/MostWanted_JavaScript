/*
    Author: devCodeCamp
    Description: Most Wanted Starter Code
*/
//////////////////////////////////////////* Beginning Of Starter Code *//////////////////////////////////////////

"use strict";
//? Utilize the hotkey to hide block level comment documentation
////* Mac: Press "CMD"+"K" and then "CMD"+"/"
////* PC: Press "CTRL"+"K" and then "CTRL"+"/"

/**
 * This is the main logic function being called in index.html.
 * It operates as the entry point for our entire application and allows
 * our user to decide whether to search by name or by traits.
 * @param {Array} people        A collection of person objects.
 */
function app(people) {
    // promptFor() is a custom function defined below that helps us prompt and validate input more easily
    // Note that we are chaining the .toLowerCase() immediately after the promptFor returns its value
    let searchType = promptFor(
        "Do you know the name of the person you are looking for? Enter 'yes' or 'no'",
        yesNo
    ).toLowerCase();
    let searchResults;
    // Routes our application based on the user's input
    switch (searchType) {
        case "yes":
            searchResults = searchByName(people);
            break;
        case "no":
            //! TODO: Declare a searchByTrait function //////////////////////////////////////////
            searchResults = searchByTrait(people);
            let userInput = promptFor("Do you want to pick another trait? [Yes/No]: ", validator)
            while(userInput === "yes"){
                searchResults = searchByTrait(searchResults);
                userInput = promptFor("Do you want to pick another trait? [Yes/No]: ", validator)
            }
            break;
        default:
            // Re-initializes the app() if neither case was hit above. This is an instance of recursion.
            app(people);
            break;
    }

    // Calls the mainMenu() only AFTER we find the SINGLE PERSON
    mainMenu(searchResults, people);

}
// End of app()

/**
 * After finding a single person, we pass in the entire person-object that we found,
 * as well as the entire original dataset of people. We need people in order to find
 * descendants and other information that the user may want.
 * @param {Object[]} person     A singular object inside of an array.
 * @param {Array} people        A collection of person objects.
 * @returns {String}            The valid string input retrieved from the user.
 */
function mainMenu(person, people) {
    // A check to verify a person was found via searchByName() or searchByTrait()
    let displayOption;
    if (!person[0]) {
        alert("Could not find that individual.");
        // Restarts app() from the very beginning
        return app(people);
    }else if(person.length === 1){
        displayOption = prompt(
            `Found ${person[0].firstName} ${person[0].lastName}. Do you want to know their 'info', 'family', or 'descendants'?\nType the option you want or type 'restart' or 'quit'.`
        );
    }else{
        let displayNamesArray = []
        alert('The following people matched your trait specifications.')
        displayNamesArray = person.map (obj => `${obj.firstName} ${obj.lastName}.\n`)

        displayOption = prompt(`${displayNamesArray}\nWould you like to 'restart' or 'quit'.`)
    }
    
    // Routes our application based on the user's input
    switch (displayOption) {
        case "info":
            //! TODO: Declare a findPersonInfo function //////////////////////////////////////////
            // HINT: Look for a person-object stringifier utility function to help
            let personInfo = findPersonInfo(person);
            alert(personInfo);
            break;
        case "family":
            //! TODO: Declare a findPersonFamily function //////////////////////////////////////////
            // HINT: Look for a people-collection stringifier utility function to help
            let personFamily = findPersonFamily(person, people);
            alert(personFamily);
            break;
        case "descendants":
            //! TODO: Declare a findPersonDescendants function //////////////////////////////////////////
            // HINT: Review recursion lecture + demo for bonus user story
            let personDescendants = findPersonDescendants(person[0], people);
            alert(personDescendants);
            break;
        case "restart":
            // Restart app() from the very beginning
            app(people);
            break;
        case "quit":
            // Stop application execution
            return;
        default:
            // Prompt user again. Another instance of recursion
            return mainMenu(person, people);
    }
}
// End of mainMenu()

function findPersonFamily(person, people){
    let personParents = findPersonNameFromPk(person, 'parents', people)
    let personSpouse = findPersonNameFromPk(person, 'currentSpouse', people)
    let personSiblings = findAllSiblings(person, people)
}

function findPersonNameFromPk(person, trait, people){
    let personPk = person.map(element=>element[trait]);
    if (personPk[0] === null){
        return undefined;
    };
    let personNames = []
    if (personPk[0].length === 1){
        people.filter(function(element){
            if(element.id == personPk[0]){
                personNames.push(`${element.firstName} ${element.lastName}`);
            }
        })
    }else{
        for (let i = 0; i < personPk[0].length; i++){
            people.filter(function(element){
                if(element.id == personPk[0][0+i]){
                    personNames.push(`${element.firstName} ${element.lastName}`);
                }
            })
        }  
    }
    return personNames;
};

function findAllSiblings(person, people){
 
    let siblings = people.filter(
        function(obj){
            if(person[0].parents === obj.parents){
                return true
            }
        }
    ).map(siblingsObj => `${siblingsObj.firstName} ${siblingsObj.lastName}`);
}




  





      /*  console.log(personParents)
    }else if (personParentsPk.length === 2){
        let personParents = people.filter(function(element){
            if(element.id == personParentsPk[0]){
                return true;
            }
    }*/





function findPersonInfo(person){
    let result = person.map(obj => `First Name: ${obj.firstName}\nLast Name: ${obj.lastName}\nGender: ${obj.gender}\nDOB: ${obj.dob}\nHeight: ${obj.height}\nWeight: ${obj.weight}\nEye Color: ${obj.eyeColor}\nOccupation: ${obj.occupation}`)
    return result
};
/**
 * This function is used when searching the people collection by
 * a person-object's firstName and lastName properties.
 * @param {Array} people        A collection of person objects.
 * @returns {Array}            An array containing the person-object (or empty array if no match)
 */
function searchByName(people) {
    let firstName = promptFor("What is the person's first name?", validator);
    let lastName = promptFor("What is the person's last name?", validator);

    // The foundPerson value will be of type Array. Recall that .filter() ALWAYS returns an array.
    let foundPerson = people.filter(function (person) {
        if (person.firstName === firstName && person.lastName === lastName) {
            return true;
        }
    });
    return foundPerson;
}
// End of searchByName()

/**This function is used when searching the people collection by a 
 * person-object's trait properties.
 * @param {Array} people        A collection of person objects.
 * @return {Array}              An array containing the person-objects (or empty array if no match)
 */



function searchByTrait(people) {
    let trait = promptFor("What is the type of trait you want to search by?\nTraits:\nGender, DOB, Height, Weight, Eyecolor, Occuption, Parents, Current Spouse : ", validator).toLocaleLowerCase()
    switch (trait) {
        case "gender":
            let gender = promptFor("What is their gender?: ", validator, "gender")
            var filteredTrait = filterByTrait(people, "gender", gender);
            break;
        case "dob":
            let dob = promptFor("What is their date of birth?: [M/DD/YYYY]", validator, "dob")
            var filteredTrait = filterByTrait(people, "dob", dob);  
            break;             
        case "height":
            let height =  parseInt(promptFor("What is their height?: ", validator, "height"))
            var filteredTrait = filterByTrait(people, "height", height);
            break;
        case "weight":
            let weight =  parseInt(promptFor("What is their weight?: ", validator, "weight"))
            var filteredTrait = filterByTrait(people, "weight", weight);
            break;
        case "eyecolor":
            let eyecolor =  promptFor("What is their eye color?: ", validator, "eyeColor")
            var filteredTrait = filterByTrait(people, "eyeColor", eyecolor);
            break;
        case "occuption":
            let occupation =  promptFor("What is their occupation?: ", validator, "occuption")
            var filteredTrait = filterByTrait(people, "occupation", occupation);
            break;
        case "parents":
            let parents =  promptFor("who are their parents: ", validator, "parents")
            var filteredTrait = filterByTrait(people, "parents", parents);
            break;
        case "spouse":
            let spouse = promptFor("Who is their spouse?: ", validator, "currentSpouse")
            var filteredTrait = filterByTrait(people, "currentSpouse", spouse);
            break;
    }
    return filteredTrait;   
}

function filterByTrait(people, trait, input) {
    let result = people.filter(
        function (person) {
            if (person[trait] === input) {
                return true;
            };
        }
    );
    return result;
   
};




/**
 * This function will be useful for STRINGIFYING a collection of person-objects
 * first and last name properties in order to easily send the information
 * to the user in the form of an alert().
 * @param {Array} people        A collection of person objects.
 */
function displayPeople(people) {
    alert(
        people
            .map(function (person) {
                return `${person.firstName} ${person.lastName}`;
            })
            .join("\n")
    );
}
// End of displayPeople()

/**
 * This function will be useful for STRINGIFYING a person-object's properties
 * in order to easily send the information to the user in the form of an alert().
 * @param {Object} person       A singular object.
 */
function displayPerson(person) {
    let personInfo = `First Name: ${person.firstName}\n`;
    personInfo += `Last Name: ${person.lastName}\n`;
    //! TODO: finish getting the rest of the information to display //////////////////////////////////////////
    alert(personInfo);
}
// End of displayPerson()

/**
 * This function's purpose is twofold:
 * First, to generate a prompt with the value passed in to the question parameter.
 * Second, to ensure the user input response has been validated.
 * @param {String} question     A string that will be passed into prompt().
 * @param {Function} valid      A callback function used to validate basic user input.
 * @returns {String}            The valid string input retrieved from the user.
 */
function promptFor(question, valid, trait) {
    do {
        var response = prompt(question).trim();
    } while (!response || !valid(response, trait) == true);
    return response;
}
// End of promptFor()

/**
 * This helper function checks to see if the value passed into input is a "yes" or "no."
 * @param {String} input        A string that will be normalized via .toLowerCase().
 * @returns {Boolean}           The result of our condition evaluation.
 */
function yesNo(input) {
    return input.toLowerCase() === "yes" || input.toLowerCase() === "no";
}
// End of yesNo()

/**
 * This helper function operates as a default callback for promptFor's validation.
 * Feel free to modify this to suit your needs.
 * @param {String} input        A string.
 * @returns {Boolean}           Default validation -- no logic yet.
 */
function validator(input, trait) {
    return true; // Default validation only
}
// End of chars()

//////////////////////////////////////////* End Of Starter Code *//////////////////////////////////////////
// Any additional functions can be written below this line 👇. Happy Coding! 😁

/*function findPersonParents(person, people){
    let personParentsPk = person.map(element=>element.parents);
    let personParents = [];
    if (personParentsPk[0].length === 1){
        people.filter(function(element){
            if(element.id == personParentsPk[0]){
                personParents.push(`${element.firstName} ${element.lastName}`);
            }
        })
    }else{
        for (let i = 0; i < personParentsPk[0].length; i++){
            people.filter(function(element){
                if(element.id == personParentsPk[0][0+i]){
                    personParents.push(`${element.firstName} ${element.lastName}`);
                }
            })
        }  
    }
    console.log(personParents)
    return personParents */


/*function mainMenu(person, people) {
    // A check to verify a person was found via searchByName() or searchByTrait()
    let displayOption;
    if (!person[0]) {
        alert("Could not find that individual.");
        // Restarts app() from the very beginning
        return app(people);
    }else if(person.length === 1){
        displayOption = prompt(
            `Found ${person[0].firstName} ${person[0].lastName}. Do you want to know their 'info', 'family', or 'descendants'?\nType the option you want or type 'restart' or 'quit'.`
        );
    }else{
        let displayNamesArray = []
        alert('The following people matched your trait specifications.')
        displayNamesArray = person.map (obj => `${obj.firstName} ${obj.lastName}.\n`)

        displayOption = prompt(`${displayNamesArray}\nWould you like to 'restart' or 'quit'.`)
    }
    
    // Routes our application based on the user's input
    switch (displayOption) {
        case "info":
            //! TODO: Declare a findPersonInfo function //////////////////////////////////////////

            // HINT: Look for a person-object stringifier utility function to help
            let personInfo = findPersonInfo(person);
            alert(personInfo);
            break;
        case "family":
            //! TODO: Declare a findPersonFamily function //////////////////////////////////////////
            function findPersonFamily(person, people){
                let findParents;
                let findSpouse;
                let findSiblings;
                let ParentKeys = person.filter(function (obj) {
                    if(obj.parents)
                })
                if (ParentKeys){
                    findParents = people.filter(
                        function(obj){
                            if(obj.id === ParentKeys)
                            return true;
                        }
                    ).map(spo => `${spo.firstName} ${spo.lastName}`)
                }else{
                    return "No parents in system"
                }
                
                let spouseKey = person.filter(obj.spouse)
                if (spouseKey){
                    findSpouse = people.filter(
                        function(obj){
                            if(obj.id === spouseKey)
                            return true;
                        }
                    ).map(spo => `${spo.firstName} ${spo.lastName}`)
                }else{
                    return "No spouse in system"
                }

                if (ParentKeys){
                    findSiblings = people.filter(
                        function(obj){
                            if(obj.parents === person.ParentKeys)
                            return true;
                        }
                    ).map(spo => `${spo.firstName} ${spo.lastName}`)
                }else{
                    return "No parents in system"
                }
            };
            // HINT: Look for a people-collection stringifier utility function to help
            let personFamily = findPersonFamily(person, people);
            alert(personFamily);
            break;
        case "descendants":
            //! TODO: Declare a findPersonDescendants function //////////////////////////////////////////
            // HINT: Review recursion lecture + demo for bonus user story
            let personDescendants = findPersonDescendants(person[0], people);
            alert(personDescendants);
            break;
        case "restart":
            // Restart app() from the very beginning
            app(people);
            break;
        case "quit":
            // Stop application execution
            return;
        default:
            // Prompt user again. Another instance of recursion
            return mainMenu(person, people);
    }
}
// End of mainMenu()*/