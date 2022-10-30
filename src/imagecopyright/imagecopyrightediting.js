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

                if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
                    return;
                }

                const viewWriter = conversionApi.writer;
                const figure = conversionApi.mapper.toViewElement( data.item );

                // if ( data.attributeNewValue !== null ) {
                //     viewWriter.setStyle( 'max-width', data.attributeNewValue + 'px', figure );
                //     viewWriter.addClass( 'image_resized', figure );
                // } else {
                //     viewWriter.removeStyle( 'max-width', figure );
                //     viewWriter.removeClass( 'image_resized', figure );
                // }
            } ));

        // upcast
        // View -> Model
        // _viewToModelConverter
        editor.conversion.for( 'upcast' ).attributeToAttribute( {
            view: {
                name: imageType === 'imageBlock' ? 'figure' : 'img',
                styles: {
                    'copyright-notice': /.+/
                }
            },
            model: {
                key: 'copyright-notice',
                value: viewElement => {
                    return viewElement.getStyle('copyright-notice').match(/\d+/g);
                }
            },
            converterPriority: 'low'
        } );
    }
}
