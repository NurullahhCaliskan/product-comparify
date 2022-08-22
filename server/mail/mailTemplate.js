import moment from 'moment';

export default function getMailTemplate(obj) {
    let { storeId, email, message, topic } = obj;

    let template =
        '  <html> ' +
        '<head> ' +
        '    <style type="text/css"> ' +
        '        @font-face { ' +
        '            font-weight: 400; ' +
        '            font-style: normal; ' +
        "            font-family: 'Circular-Loom'; " +
        ' ' +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Book-cd7d2bcec649b1243839a15d5eb8f0a3.woff2') format('woff2'); " +
        '        } ' +
        ' ' +
        '        @font-face { ' +
        '            font-weight: 500; ' +
        '            font-style: normal; ' +
        "            font-family: 'Circular-Loom'; " +
        ' ' +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Medium-d74eac43c78bd5852478998ce63dceb3.woff2') format('woff2'); " +
        '        } ' +
        ' ' +
        '        @font-face { ' +
        '            font-weight: 700; ' +
        '            font-style: normal; ' +
        "            font-family: 'Circular-Loom'; " +
        ' ' +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Bold-83b8ceaf77f49c7cffa44107561909e4.woff2') format('woff2'); " +
        '        } ' +
        ' ' +
        '        @font-face { ' +
        '            font-weight: 900; ' +
        '            font-style: normal; ' +
        "            font-family: 'Circular-Loom'; " +
        ' ' +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Black-bf067ecb8aa777ceb6df7d72226febca.woff2') format('woff2'); " +
        '        }</style> ' +
        '    <style type="text/css"> ' +
        '        @font-face { ' +
        '            font-weight: 400; ' +
        '            font-style: normal; ' +
        "            font-family: 'Circular-Loom'; " +
        ' ' +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Book-cd7d2bcec649b1243839a15d5eb8f0a3.woff2') format('woff2'); " +
        '        } ' +
        ' ' +
        '        @font-face { ' +
        '            font-weight: 500; ' +
        '            font-style: normal; ' +
        "            font-family: 'Circular-Loom'; " +
        ' ' +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Medium-d74eac43c78bd5852478998ce63dceb3.woff2') format('woff2'); " +
        '        } ' +
        ' ' +
        '        @font-face { ' +
        '            font-weight: 700; ' +
        '            font-style: normal; ' +
        "            font-family: 'Circular-Loom'; " +
        ' ' +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Bold-83b8ceaf77f49c7cffa44107561909e4.woff2') format('woff2'); " +
        '        } ' +
        ' ' +
        '        @font-face { ' +
        '            font-weight: 900; ' +
        '            font-style: normal; ' +
        "            font-family: 'Circular-Loom'; " +
        ' ' +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Black-bf067ecb8aa777ceb6df7d72226febca.woff2') format('woff2'); " +
        '        }</style> ' +
        '    <style type="text/css"> ' +
        '        @font-face { ' +
        '            font-weight: 400; ' +
        '            font-style: normal; ' +
        "            font-family: 'Circular-Loom'; " +
        ' ' +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Book-cd7d2bcec649b1243839a15d5eb8f0a3.woff2') format('woff2'); " +
        '        } ' +
        ' ' +
        '        @font-face { ' +
        '            font-weight: 500; ' +
        '            font-style: normal; ' +
        "            font-family: 'Circular-Loom'; " +
        ' ' +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Medium-d74eac43c78bd5852478998ce63dceb3.woff2') format('woff2'); " +
        '        } ' +
        ' ' +
        '        @font-face { ' +
        '            font-weight: 700; ' +
        '            font-style: normal; ' +
        "            font-family: 'Circular-Loom'; " +
        ' ' +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Bold-83b8ceaf77f49c7cffa44107561909e4.woff2') format('woff2'); " +
        '        } ' +
        ' ' +
        '        @font-face { ' +
        '            font-weight: 900; ' +
        '            font-style: normal; ' +
        "            font-family: 'Circular-Loom'; " +
        ' ' +
        "            src: url('https://cdn.loom.com/assets/fonts/circular/CircularXXWeb-Black-bf067ecb8aa777ceb6df7d72226febca.woff2') format('woff2'); " +
        '        }</style> ' +
        '</head> ' +
        '<body style="background-color: #141414; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;"> ' +
        '<table border="0" cellPadding="0" cellSpacing="0" className="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #181824;" width="100%"> ' +
        '    <tbody> ' +
        '    <tr> ' +
        '        <td> ' +
        ' ' +
        '            <table align="center" border="0" cellPadding="0" cellSpacing="0" className="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%"> ' +
        '                <tbody> ' +
        '                <tr> ' +
        '                    <td> ' +
        '                        <table align="center" border="0" cellPadding="0" cellSpacing="0" className="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680"> ' +
        '                            <tbody> ' +
        '                            <tr> ' +
        '                                <td className="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%"> ' +
        '                                    <div className="spacer_block" style="height:60px;line-height:60px;font-size:1px;"></div> ' +
        '                                </td> ' +
        '                            </tr> ' +
        '                            </tbody> ' +
        '                        </table> ' +
        '                    </td> ' +
        '                </tr> ' +
        '                </tbody> ' +
        '            </table> ' +
        ' ' +
        '            <table align="center" border="0" cellPadding="0" cellSpacing="0" className="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%"> ' +
        '                <tbody> ' +
        '                <tr> ' +
        '                    <td> ' +
        '                        <table align="center" border="0" cellPadding="0" cellSpacing="0" className="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680"> ' +
        '                            <tbody> ' +
        '                            <tr> ' +
        '                                <td className="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%"> ' +
        '                                    <table border="0" cellPadding="0" cellSpacing="0" className="heading_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%"> ' +
        '                                        <tbody> ' +
        '                                        <tr> ' +
        '                                            <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;text-align:center;width:100%;padding-top:50px;"> ' +
        '                                                <h1 style="margin: 0; color: #ffd700; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><span className="tinyMce-placeholder">Contact Us Alert</span></h1> ' +
        '                                            </td> ' +
        '                                        </tr> ' +
        '                                        </tbody> ' +
        '                                    </table> ' +
        '                                    <table border="0" cellPadding="0" cellSpacing="0" className="heading_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%"> ' +
        '                                        <tbody> ' +
        '                                        <tr> ' +
        '                                            <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;text-align:center;width:100%;"> ' +
        '                                                <h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 34px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>New contact us mail from user</strong></h1> ' +
        '                                            </td> ' +
        '                                        </tr> ' +
        '                                        </tbody> ' +
        '                                    </table> ' +
        '                                </td> ' +
        '                            </tr> ' +
        '                            </tbody> ' +
        '                        </table> ' +
        '                    </td> ' +
        '                </tr> ' +
        '                </tbody> ' +
        '            </table> ' +
        '            <table align="center" border="0" cellPadding="0" cellSpacing="0" className="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%"> ' +
        '                <tbody> ' +
        '                <tr> ' +
        '                    <td> ' +
        '                        <table align="center" border="0" cellPadding="0" cellSpacing="0" className="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680"> ' +
        '                            <tbody> ' +
        '                            <tr> ' +
        '                                <td className="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%"> ' +
        '                                    <div className="spacer_block" style="height:30px;line-height:30px;font-size:1px;"></div> ' +
        '                                </td> ' +
        '                            </tr> ' +
        '                            </tbody> ' +
        '                        </table> ' +
        '                    </td> ' +
        '                </tr> ' +
        '                </tbody> ' +
        '            </table> ' +
        '            <table align="center" border="0" cellPadding="0" cellSpacing="0" className="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-position: center top;" width="100%"> ' +
        '                <tbody> ' +
        '                <tr> ' +
        '                    <td> ' +
        '                        <table align="center" border="0" cellPadding="0" cellSpacing="0" className="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #30304c; color: #000000; width: 680px;" width="680"> ' +
        '                            <tbody> ' +
        '                            <tr> ' +
        ' ' +
        '                                <td className="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="41.666666666666664%"> ' +
        '                                    <table border="0" cellPadding="0" cellSpacing="0" className="heading_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%"> ' +
        '                                        <tbody> ' +
        '                                        <tr> ' +
        '                                            <td style="padding-bottom:10px;padding-left:15px;padding-right:10px;text-align:center;width:100%;padding-top:35px;"> ' +
        '                                                <h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><strong>Message</strong></h1> ' +
        '                                            </td> ' +
        '                                        </tr> ' +
        '                                        </tbody> ' +
        '                                    </table> ' +
        '                                    <table border="0" cellPadding="0" cellSpacing="0" className="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%"> ' +
        '                                        <tbody> ' +
        '                                        <tr> ' +
        '                                            <td style="padding-bottom:15px;padding-left:15px;padding-right:10px;padding-top:10px;"> ' +
        '                                                <div style="font-family: sans-serif"> ' +
        '                                                    <div className="txtTinyMce-wrapper" style="font-size: 14px; mso-line-height-alt: 21px; color: #ffffff; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;"> ' +
        '                                                        <p style="margin: 0; font-size: 14px; text-align: left;">Message: :message</p> ' +
        '                                                        <p style="margin: 0; font-size: 14px; text-align: left;">Email: :email</p> ' +
        '                                                        <p style="margin: 0; font-size: 14px; text-align: left;">StoreId: :storeId</p> ' +
        '                                                        <p style="margin: 0; font-size: 14px; text-align: left;">Date: :date</p> ' +
        '                                                        <p style="margin: 0; font-size: 14px; text-align: left;">Topic: :topic</p> ' +
        '                                                    </div> ' +
        '                                                </div> ' +
        '                                            </td> ' +
        '                                        </tr> ' +
        '                                        </tbody> ' +
        '                                    </table> ' +
        '                                </td> ' +
        ' ' +
        '                            </tr> ' +
        '                            </tbody> ' +
        '                        </table> ' +
        '                    </td> ' +
        '                </tr> ' +
        '                </tbody> ' +
        '            </table> ' +
        '            <table align="center" border="0" cellPadding="0" cellSpacing="0" className="row row-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%"> ' +
        '                <tbody> ' +
        '                <tr> ' +
        '                    <td> ' +
        '                        <table align="center" border="0" cellPadding="0" cellSpacing="0" className="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680"> ' +
        '                            <tbody> ' +
        '                            <tr> ' +
        '                                <td className="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%"> ' +
        '                                    <div className="spacer_block" style="height:10px;line-height:10px;font-size:1px;"></div> ' +
        '                                </td> ' +
        '                            </tr> ' +
        '                            </tbody> ' +
        '                        </table> ' +
        '                    </td> ' +
        '                </tr> ' +
        '                </tbody> ' +
        '            </table> ' +
        ' ' +
        ' ' +
        '            <table align="center" border="0" cellPadding="0" cellSpacing="0" className="row row-12" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%"> ' +
        '                <tbody> ' +
        '                <tr> ' +
        '                    <td> ' +
        '                        <table align="center" border="0" cellPadding="0" cellSpacing="0" className="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680"> ' +
        '                            <tbody> ' +
        '                            <tr> ' +
        '                                <td className="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%"> ' +
        '                                    <div className="spacer_block" style="height:60px;line-height:60px;font-size:1px;"></div> ' +
        '                                </td> ' +
        '                            </tr> ' +
        '                            </tbody> ' +
        '                        </table> ' +
        '                    </td> ' +
        '                </tr> ' +
        '                </tbody> ' +
        '            </table> ' +
        ' ' +
        ' ' +
        '        </td> ' +
        '    </tr> ' +
        '    </tbody> ' +
        '</table> ' +
        ' ' +
        ' ' +
        '</body> ' +
        '</html>  ';

    template = template.replace(':storeId', storeId);
    template = template.replace(':message', message);
    template = template.replace(':email', email);
    template = template.replace(':topic', topic);
    template = template.replace(':date', moment().format('YYYY-MM-DDTHH:mm:ss.SSS000'));

    return template;
}
