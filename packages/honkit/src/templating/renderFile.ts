// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Promise'.
const Promise = require("../utils/promise");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'error'.
const error = require("../utils/error");
const render = require("./render");

/**
 * Render a template
 *
 * @param {TemplateEngine} engine
 * @param {String} filePath
 * @param {Object} context
 * @return {Promise<TemplateOutput>}
 */
function renderTemplateFile(engine, filePath, context) {
    const loader = engine.getLoader();

    // Resolve the filePath
    const resolvedFilePath = loader.resolve(null, filePath);

    // @ts-expect-error ts-migrate(2348) FIXME: Value of type 'PromiseConstructor' is not callable... Remove this comment to see the full error message
    return Promise()
        .then(() => {
            if (!loader.async) {
                return loader.getSource(resolvedFilePath);
            }

            // @ts-expect-error ts-migrate(2339) FIXME: Property 'defer' does not exist on type 'PromiseCo... Remove this comment to see the full error message
            const deferred = Promise.defer();
            loader.getSource(resolvedFilePath, deferred.makeNodeResolver());
            return deferred.promise;
        })
        .then((result) => {
            if (!result) {
                throw error.TemplateError(new Error("Not found"), {
                    filename: filePath,
                });
            }

            return render(engine, result.path, result.src, context);
        });
}

module.exports = renderTemplateFile;
