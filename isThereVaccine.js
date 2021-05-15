#!/usr/bin/gjs
const {GLib, Soup, Gtk} = imports.gi;
const Lang = imports.lang;

imports.gi.versions.Gtk = '3.0'

const url = "https://www.keldoc.com/api/patients/v2/timetables/96790?from=2021-05-11&to=2021-05-15&agenda_ids%5B%5D=53306%2C53307%2C53308%2C53309%2C53310%2C53311%2C53312%2C53313%2C53314%2C53315%2C53316%2C53317%2C53318%2C53320%2C53321%2C53322%2C53323%2C53324%2C53325%2C53326%2C53327%2C53328%2C53329%2C53330%2C53331"
const alpeExpo =  "https://www.keldoc.com/api/patients/v2/timetables/96790?from=2021-05-13&to=2021-05-17&agenda_ids[]=53306,53307,53308,53309,53310,53311,53312,53313,53314,53315,53316,53317,53318,53320,53321,53322,53323,53324,53325,53326,53327,53328,53329,53330,53331"
const eybens = "https://www.keldoc.com/api/patients/v2/timetables/96716?from=2021-05-13&to=2021-05-17&agenda_ids%5B%5D=48917%2C48918%2C48919"
const chu = "https://www.keldoc.com/api/patients/v2/timetables/97095?from=2021-05-13&to=2021-05-17&agenda_ids[]=56266,56268,56269,56270,56271,56277,56306,56390,56391,56392,56393"

const urls = [
    { name : "alpexpo", url: alpeExpo },
    { name : 'eybens', url: eybens },
    { name: 'chu', url: chu}
]
const maxCount = urls.length
function setInterval(func, delay, ...args) {
    const wrappedFunc = () => {
        return func.apply(this, args) || true;
    };
    return GLib.timeout_add(GLib.PRIORITY_DEFAULT, delay, wrappedFunc);
}


function AreAllArrayEmpty(availabilities){
    return Object.values(availabilities).filter((a)=> a.length > 0).length > 0
}


class Application {

    //create the application
    constructor() {
        this.application = new Gtk.Application();
        this.called = 0
       //connect to 'activate' and 'startup' signals to handlers.
       this.application.connect('activate', this._onActivate.bind(this));
       this.application.connect('startup', this._onStartup.bind(this));
       this.count= 0
    }

    //create the UI
    _buildUI() {

        this._window = new Gtk.ApplicationWindow({ application: this.application,
                                                   title: "Hello World!" });
        this._window.set_default_size(500, 1000);
        this.label = new Gtk.Label({ label: 'Hello!' });       
        
        this._window.add(this.label);
    }
    _createPollLoop(){
        this._pollLoop()
        this.interval = setInterval(this._pollLoop.bind(this), 30000) // 300000
    }

    _pollLoop() {
        this.label.set_label('calling ...')
        print('calling...')
        let msg = Soup.Message.new('GET', url[this.count]);
        this._soupSession.send_message(msg);
        const data = msg.response_body.data
        const obj = JSON.parse(data)
        this.count++
        if(!obj.availabilities){ 
            this.label.set_label('ya pud place')
            print('ya pud place')
            return
        }
        if(areAllArrayEmpty(obj.availabilities)){
            this.label.set_label('ya une réponse mais tous les créneaux sont vides')
            print('ya dla place')
            return
        }
        this.label.set_label('ya dla place')
        print('ya dla place')
    }

    //handler for 'activate' signal
    _onActivate() {
        //show the window and all child widgets
        this._window.show_all();
        this._createPollLoop();

    }

    //handler for 'startup' signal
    _onStartup() {
        this._soupSession = new Soup.SessionSync();
        this._buildUI();
    }
};

//run the application
let app = new Application();
app.application.run(ARGV);