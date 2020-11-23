class Erreur {
    constructor(messageErreur) {
        this.messageErreur = messageErreur;
    }

    toJSON () {
        return {
            'error': this.messageErreur,
        };
    }
}

module.exports = Erreur;