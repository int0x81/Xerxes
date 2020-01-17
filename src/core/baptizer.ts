/**
 * The baptizer provides unique names 
 * for new created creeps
 */
export class Baptizer {

    private names: string[] = [
        "Aaren",
        "Aarika",
        "Addie",
        "Adora",
        "Adrianna",
        "Agata",
        "Agathe",
        "Aggi",
        "Aggie",
        "Aggy",
        "Dulcia",
        "Dulcine",
        "Dulcy",
        "Dulsea",
        "Dusty",
        "Dyan",
        "Lexis",
        "Libbey",
        "Lindsey",
        "Melva",
        "Merl",
        "Merry",
        "Mia",
        "Micky",
        "Mina",
        "Pepita",
        "Peri",
        "Perry",
        "Phoebe",
        "Rachel",
        "Rafaela",
        "Randi",
        "Sharon",
        "Shir",
        "Zia",
        "Zora"
    ];

    /**
     * Provides a unique name that has is currently not in use
     * and can be assigned to a creep
     * @returns A unique name
     */
    getName(): string {

        for(let name of this.names) {

            if(!Game.creeps[name]) 
                return name;
        }

        throw Error("Insufficient amount of names");
    }
}