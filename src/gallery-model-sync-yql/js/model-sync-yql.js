/**
An Extension which provides a YQL sync implementation that can be mixed into a
Model or ModelList subclass.

@module gallery-model-sync-yql
**/

/**
This makes it trivial for your Model or ModelList subclasses to load data from
YQL.

**Note:** that `read` is the only `sync()` action that is supported at this
time, you will not be able to `save()` data to YQL.

@TODO: Example

@class ModelSync.YQL
@extension Model ModelList
**/

var YQLSync;

// *** YQLSYnc *** //

YQLSync = function () {};

// *** Namespace *** //

Y.namespace('ModelSync').YQL = YQLSync;
