import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import InputTextView from "@ckeditor/ckeditor5-ui/src/inputtext/inputtextview";

import '../../theme/image-copyright.css';

/**
 * The image style UI plugin.
 */
export default class ImageCopyrightUi extends Plugin {
    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'ImageCopyrightUi';
    }


    /**
     * @inheritDoc
     */
    init() {
        this._createInput();
    }


    /**
     * Creates an input for image-copyright and stores it in the editor
     * @private
     */
    _createInput() {
        const editor = this.editor;
        const componentName = `imageCopyright`; //TODO refactor this to imageCopyrightInput

        editor.ui.componentFactory.add( componentName, locale => {
            const command = editor.commands.get( 'imageCopyright' );
            const input = new InputTextView( locale );

            input.set( {
                placeholder: 'copyright',
            } );

            input.extendTemplate({
                attributes: {
                    class: [
                        'image-copyright-input'
                    ]
                }
            })

            input.bind( 'value' ).to( command, (value) => {
                return value ? value['copyright-notice'] : null;
            } );

            input.on('input', () => {
                console.log(input);
                this._validateInput(input);
                if (input.hasError) {
                    return input;
                } else if (input.isEmpty) {
                    editor.execute( 'imageCopyright', {
                        'copyright-notice': null
                    });
                } else {
                    editor.execute('imageCopyright', {
                        'copyright-notice': input.element.value
                    });
                }
            } );

            return input;
        } );
    }

    _validateInput(view) {
        view.set('errorText', null);
        view.set('hasError', false);
        view.set('isEmpty', true);

        /*if (isNaN(view.element.value)) {
            view.set('errorText', 'Input must be numeric');
            view.set('hasError', true);
        }

        if (view.element.value < 10) {
            view.set('errorText', `Minimum size must be more than 10px`);
            view.set('hasError', true);
        }

        if (view.element.value.length !== 0) {
            view.set('isEmpty', false);
        } else {
            view.set('errorText', null);
            view.set('hasError', false);
            view.set('isEmpty', true);
        }*/
        return view;
    }
}
