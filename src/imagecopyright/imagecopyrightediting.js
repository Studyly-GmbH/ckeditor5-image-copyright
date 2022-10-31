import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ImageCopyrightCommand from "./imagecopyrightcommand";
import ImageUtils from "@ckeditor/ckeditor5-image/src/imageutils";

export default class ImageCopyrightEditing extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ ImageUtils ];
    }
    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'ImageCopyrightEditing';
    }

    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const schema = editor.model.schema;

        // Register imageSize command.
        editor.commands.add( 'imageCopyright', new ImageCopyrightCommand( editor ) );

        schema.extend( 'imageInline', {
            allowAttributes: [
                'copyright-notice'
            ]
        } );
        schema.extend( 'imageBlock', {
            allowAttributes: [
                'copyright-notice'
            ]
        } );
        this._registerConverters( editor, 'imageBlock' );
        this._registerConverters( editor, 'imageInline' );
    }

    _registerConverters( editor , imageType ) {
        editor.conversion.for( 'downcast' ).add( dispatcher =>
            dispatcher.on( `attribute:copyright-notice:${ imageType }`, ( evt, data, conversionApi ) => {
                console.log('downcast');
                if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
                    return;
                }

                const viewWriter = conversionApi.writer;
                const figure = conversionApi.mapper.toViewElement( data.item );

                if ( data.attributeNewValue !== null ) {
                    viewWriter.setAttribute( 'copyright-notice', data.attributeNewValue, figure );
                    viewWriter.addClass( 'image_copyright', figure );
                } else {
                    viewWriter.removeAttribute( 'copyright-notice', figure );
                    viewWriter.removeClass( 'image_copyright', figure );
                }
            } ));

        // upcast
        // View -> Model
        // _viewToModelConverter
        editor.conversion.for( 'upcast' ).attributeToAttribute( {
            view: {
                name: imageType === 'imageBlock' ? 'figure' : 'img',
                key: 'copyright-notice'
            },
            model: {
                key: 'copyright-notice',
                value: viewElement => {
                    console.log('upcast model');
                    console.log(viewElement);
                    console.log(viewElement.getAttribute('copyright-notice'));
                    return viewElement.getAttribute('copyright-notice');
                }
            },
            converterPriority: 'low'
        } );
    }
}
