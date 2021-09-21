#include "json2.js";
#include "layouts.jsx";
#include "templates.jsx";
#include "constants.jsx";
#include "../settings.jsx";

function retrieve_card_name_and_artist(file) {
    /**
     * Retrieve card name and (if specified) artist from the input file.
     */

    var filename = decodeURI(file.name);
    var filename_no_ext = filename.slice(0, filename.lastIndexOf("."));

    var open_index = filename_no_ext.lastIndexOf(" (");
    var close_index = filename_no_ext.lastIndexOf(")");

    var card_name = filename_no_ext;
    var artist = "";

    if (open_index > 0 && close_index > 0) {
        // File name includes artist name - slice and dice
        artist = filename_no_ext.slice(open_index + 2, close_index);
        card_name = filename_no_ext.slice(0, open_index);
    }

    return {
        card_name: card_name,
        artist: artist,
    }
}

function call_python(card_name, file_path) {
    /**
     * Calls the Python script which queries Scryfall for card info and saves the resulting JSON dump to disk in \scripts.
     * Returns the parsed JSON result if the Python call was successful, or raises an error if it wasn't.
     */

    // default to Windows command
    var python_command = "python \"" + file_path + "/scripts/get_card_info.py\" \"" + card_name + "\"";
    if ($.os.search(/windows/i) === -1) {
        // macOS
        python_command = "/usr/local/bin/python3 \"" + file_path + "/scripts/get_card_info.py\" \"" + card_name + "\" >> " + file_path + "/scripts/debug.log 2>&1";
    }
    app.system(python_command);

    var json_file = new File(file_path + json_file_path);
    json_file.open('r');
    var json_string = json_file.read();
    json_file.close();
    if (json_string === "") {
        throw new Error(
            "\n\ncard.json does not exist - the system failed to successfully run get_card_info.py.\nThe attempted Python call was made with the " +
            "following command:\n\n" + python_command + "\n\nYou may need to edit this command in render.jsx depending on your computer's configuration. " +
            "Try running the command from the command line as that may help you debug the issue"
        );
    }
    return JSON.parse(JSON.parse(json_string));
}

function select_template(layout, file, file_path) {
    /**
     * Instantiate a template object based on the card layout and user settings.
     */

    // Map card classes to template classes
    // (have to insert one at a time - otherwise the key will be the variable name)
    var class_template_map = {};
    class_template_map[normal_class] = {
        default_: NormalTemplate,
        other: [
            NormalClassicTemplate,
            NormalExtendedTemplate,
            WomensDayTemplate,
            StargazingTemplate,
            MasterpieceTemplate,
            ExpeditionTemplate,
        ],
    };
    class_template_map[transform_front_class] = {
        default_: TransformFrontTemplate,
        other: [],
    };
    class_template_map[transform_back_class] = {
        default_: TransformBackTemplate,
        other: [],
    };
    class_template_map[ixalan_class] = {
        default_: IxalanTemplate,
        other: [],
    };
    class_template_map[mdfc_front_class] = {
        default_: MDFCFrontTemplate,
        other: [],
    };
    class_template_map[mdfc_back_class] = {
        default_: MDFCBackTemplate,
        other: [],
    };
    class_template_map[mutate_class] = {
        default_: MutateTemplate,
        other: [],
    };
    class_template_map[adventure_class] = {
        default_: AdventureTemplate,
        other: [],
    };
    class_template_map[leveler_class] = {
        default_: LevelerTemplate,
        other: [],
    };
    class_template_map[saga_class] = {
        default_: SagaTemplate,
        other: [],
    };
    class_template_map[miracle_class] = {
        default_: MiracleTemplate,
        other: [],
    };
    class_template_map[planeswalker_class] = {
        default_: PlaneswalkerTemplate,
        other: [
            PlaneswalkerExtendedTemplate,
        ],
    };
    class_template_map[snow_class] = {
        default_: SnowTemplate,
        other: [],
    };
    class_template_map[basic_class] = {
        default_: BasicLandTemplate,
        other: [
            BasicLandClassicTemplate,
            BasicLandTherosTemplate,
            BasicLandUnstableTemplate,
        ],
    };
    class_template_map[planar_class] = {
        default_: PlanarTemplate,
        other: [],
    };

    var template_class = class_template_map[layout.card_class];
    var template = template_class.default_;
    if (specified_template !== null && in_array(template_class.other, specified_template)) {
        // a template was specified and it's allowed to be used for this card class
        template = specified_template;
    }

    return new template(layout, file, file_path);
}

function render(file) {
    // TODO: specify the desired template for a card in the filename?
    var file_path = File($.fileName).parent.parent.fsName;

    var ret = retrieve_card_name_and_artist(file);
    var card_name = ret.card_name;
    var artist = ret.artist;

    if (in_array(BasicLandNames, card_name)) {
        // manually construct layout obj for basic lands
        var layout = {
            artist: artist,
            name: card_name,
            card_class: basic_class,
        };
    } else {
        var scryfall = call_python(card_name, file_path);
        var layout_name = scryfall.layout;

        // instantiate layout obj (unpacks scryfall json and stores relevant parts in obj properties)
        if (layout_name in layout_map) {
            var layout = new layout_map[layout_name](scryfall, card_name);
        } else {
            throw new Error("Layout" + layout_name + " is not supported. Sorry!");
        }

        // if artist specified in file name, insert the specified artist into layout obj
        if (artist !== "") {
            layout.artist = artist;
        }
    }

    // select and execute the template - insert text fields, set visibility of layers, etc. - and save to disk
    var file_name = select_template(layout, file, file_path).execute();
    if (exit_early) {
        throw new Error("Exiting...");
    }
    save_and_close(file_name, file_path);
}
