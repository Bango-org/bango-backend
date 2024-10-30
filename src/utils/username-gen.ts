interface UsernameOptions {
    includeNumbers?: boolean;
    useLeetSpeak?: boolean;
    useShort?: boolean;
    useVerb?: boolean;
}

interface GeneratedUsernames {
    basic: string;
    withNumber: string;
    withVerb: string;
    leetSpeak: string;
    short: string;
}

export class UsernameGenerator {
    private readonly adjectives: string[];
    private readonly nouns: string[];
    private readonly verbs: string[];

    constructor() {
        this.adjectives = [
            'Happy', 'Swift', 'Clever', 'Brave', 'Bright',
            'Cool', 'Wild', 'Epic', 'Noble', 'Bold',
            'Wise', 'Fresh', 'Magic', 'Super', 'Prime',
            'Mega', 'Ultra', 'Rapid', 'Smart', 'Proud'
        ];
        
        this.nouns = [
            'Panda', 'Eagle', 'Tiger', 'Shark', 'Wolf',
            'Dragon', 'Phoenix', 'Falcon', 'Lion', 'Bear',
            'Whale', 'Ninja', 'Wizard', 'Knight', 'Hero',
            'Warrior', 'Hunter', 'Runner', 'Scout', 'Champion'
        ];
        
        this.verbs = [
            'Jumps', 'Flies', 'Runs', 'Races', 'Dances',
            'Codes', 'Builds', 'Creates', 'Leads', 'Explores',
            'Dreams', 'Thinks', 'Games', 'Plays', 'Writes'
        ];
    }

    private getRandomElement(array: string[]): string {
        return array[Math.floor(Math.random() * array.length)];
    }

    private getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public generateBasic(): string {
        return `${this.getRandomElement(this.adjectives)}${this.getRandomElement(this.nouns)}`;
    }

    public generateWithNumber(): string {
        return `${this.generateBasic()}${this.getRandomNumber(1, 999)}`;
    }

    public generateWithVerb(): string {
        return `${this.getRandomElement(this.verbs)}${this.getRandomElement(this.nouns)}`;
    }

    public generateLeetSpeak(): string {
        const leetMap: Record<string, string> = {
            'a': '4', 'e': '3', 'i': '1', 'o': '0', 
            's': '5', 't': '7', 'l': '1'
        };
        
        let username = this.generateBasic().toLowerCase();
        for (const [letter, number] of Object.entries(leetMap)) {
            username = username.replace(new RegExp(letter, 'g'), number);
        }
        return username;
    }

    public generateShort(): string {
        const shortAdjectives = this.adjectives.map(adj => adj.slice(0, 3));
        const shortNouns = this.nouns.map(noun => noun.slice(0, 3));
        return `${this.getRandomElement(shortAdjectives)}${this.getRandomElement(shortNouns)}`;
    }

    public generateAll(): GeneratedUsernames {
        return {
            basic: this.generateBasic(),
            withNumber: this.generateWithNumber(),
            withVerb: this.generateWithVerb(),
            leetSpeak: this.generateLeetSpeak(),
            short: this.generateShort()
        };
    }

    public generate(options: UsernameOptions = {}): string {
        const {
            includeNumbers = false,
            useLeetSpeak = false,
            useShort = false,
            useVerb = false
        } = options;

        let username: string;

        if (useShort) {
            username = this.generateShort();
        } else if (useVerb) {
            username = this.generateWithVerb();
        } else {
            username = this.generateBasic();
        }

        if (includeNumbers) {
            username += this.getRandomNumber(1, 999);
        }

        if (useLeetSpeak) {
            username = this.convertToLeetSpeak(username);
        }

        return username;
    }

    private convertToLeetSpeak(text: string): string {
        const leetMap: Record<string, string> = {
            'a': '4', 'e': '3', 'i': '1', 'o': '0', 
            's': '5', 't': '7', 'l': '1'
        };
        
        let leetText = text.toLowerCase();
        for (const [letter, number] of Object.entries(leetMap)) {
            leetText = leetText.replace(new RegExp(letter, 'g'), number);
        }
        return leetText;
    }
}

// Example usage with TypeScript
export const generator = new UsernameGenerator();
