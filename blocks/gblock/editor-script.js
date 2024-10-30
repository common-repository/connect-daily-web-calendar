var CDaily= typeof(CDaily) == 'undefined' ?  {
    "RESPONSIVE_BREAK_SIZE" : 600,
    "DEFAULT_DIALOG_WIDTH"  : 600
} : CDaily;

CDaily['CAPTION_BUNDLE'] = 'connect-daily-web-calendar';

wp.blocks.registerBlockType('connect-daily-web-calendar/gblock', {
    title: 'connectDaily Calendar',
    icon: 'calendar',
    category: 'widgets',
    attributes: {
        widget_type: {
            type: 'string',
            default: 'monthview'
        },
        by_method: {
            type: 'string',
            default: 'calendar_id'
        },
        by_id: {
            type: 'string'
        },
        allow_duplicates: {
            type: 'bool',
            default: false
        },
        allow_recurrence: {
            type: 'bool',
            default: false
        },
        collapse_label: {
            type: 'string',
            default: '(-)'
        },
        collapse_threshold: {
            type: 'string',
            default: 6
        },
        content: {
            type: 'string'
        },
        dayspan: {
            type: 'string',
            default: 30
        },
        enable_dropdown: {
            type: 'bool',
            default: false
        },
        enable_styles: {
            type: 'bool',
            default: false
        },
        expand_label: {
            type: 'string',
            default: '(+)'
        },
        cal_item_id: {
            type: 'string',
            default: 0
        },
        height: {
            type: 'string',
            default: '1024px'
        },
        iframe_target: {
            type: 'string',
            default: 'View.html'
        },
        maxcount: {
            type: 'string',
            default: 6
        },
        other_options: {
            type: 'string'
        },
        show_add_button: {
            type: 'bool',
            default: false
        },
        show_endtimes: {
            type: 'bool',
            default: false
        },
        show_starttimes: {
            type: 'bool',
            default: false
        },
        title: {
            type: 'string'
        },
        width: {
            type: 'string',
            default: '100%'
        },
        wrap_events: {
            type: 'bool',
            default: false
        }
    },
    edit: function( props ) {
        
        var focus = props.isSelected;
        var el = wp.element.createElement;
        var i18n = wp.i18n;
        var sc=wp.components.SelectControl;
        var setAttributes=props.setAttributes;
        // This is overly cute. I'm defining style objects based on if they should be shown or hidden.
        var SHOWN={}, HIDDEN={display: 'none'};

        if (!props.attributes.hasOwnProperty('widget_type')) {
            setAttributes({widget_type: 'monthview'});
        }

        function getByOptions() {
            var result=[];
            CDaily.typeData.items.forEach(function(ele){
                result.push( {value: ele.type_string,label: ele.type_label});
            });
            return result;
        }

        function getByIds(byMethod){
            var result=[];
            CDaily.typeData.items.forEach(function(type) {
                    if (type.type_string==byMethod) {
                        type.items.forEach(function(item){
                            result.push({value: item.object_id,label: item.name});
                            if (!props.attributes.hasOwnProperty('by_id')) {
                                setAttributes({by_id: item.object_id});
                            }
                        });
                        return result;
                    }
                });
            return result;
        }
        
        return [
            el('p', { className: props.className, id: "cdaily-gb-block"  }, "Select this block and use the block inspector on the right to configure the calendar settings. Publish/Update and select view page/post to see your calendar."),
            !! focus && el(wp.editor.InspectorControls,
                { key: 'inspector' },
                el('p',{},i18n.__('Configure the connectDaily block.')),
                // TODO Tutorial Link
                el('a',{id: 'cdShortCodeHelpLink',href: CDaily['helpURL']+'WordPressCalendarPlugin.html',target: '_blank'},'Help' ),
                /*
                    Select Widget Type 
                */
                el(sc,{
                    id: 'cd-shortcode-type',
                    label: i18n.__('Block Type', CDaily.CAPTION_BUNDLE),
                    value: props.attributes.widget_type,
                    options: [
                        {value: 'detailedlist', label: i18n.__('COM_CONNECTDAILY_IntegrationWizardDetailedList',CDaily.CAPTION_BUNDLE)},
                        {value: 'simplelist', label: i18n.__('COM_CONNECTDAILY_IntegrationWizardSimpleList',CDaily.CAPTION_BUNDLE)},
                        {value: 'monthview', label: i18n.__('COM_CONNECTDAILY_ResponsiveCalendar',CDaily.CAPTION_BUNDLE)},
                        {value: 'filter', label: i18n.__('COM_CONNECTDAILY_EventsFilter',CDaily.CAPTION_BUNDLE)},
                        {value: 'minicalendar', label: i18n.__('COM_CONNECTDAILY_IntegrationWizardMiniCalendar',CDaily.CAPTION_BUNDLE)},
                        {value: 'addevent', label: i18n.__('COM_CONNECTDAILY_AddEventForm',CDaily.CAPTION_BUNDLE)},
                        {value: 'icalendar', label: i18n.__('COM_CONNECTDAILY_iCalendarLink',CDaily.CAPTION_BUNDLE)},
                        {value: 'search', label: i18n.__('COM_CONNECTDAILY_Search',CDaily.CAPTION_BUNDLE)},
                        {value: 'event', label: i18n.__('COM_CONNECTDAILY_SingleEvent',CDaily.CAPTION_BUNDLE)},
                        {value: 'iframe', label: i18n.__('COM_CONNECTDAILY_CalendarIFrame',CDaily.CAPTION_BUNDLE)}
                    ],
                    onChange: function(params){
                        setAttributes({other_options: "", widget_type: params});
                        CDaily.toggleFieldSets();
                        }
                }),
                /*
                    Events Field Set
                 
                    Applies to:
                 
                    Simple List
                    Detailed List
                    Search
                    Responsive Full Sized
                    Mini-Calendar
                    IFRAME
                    iCalendarLink
                 
                    Show Events By
                    Show Events For
                 
                    IFRAME: Calendar Format (month view, week view, etc)
                */
                el(
                    'fieldset',
                    {id: 'cd-events',
                        style: ['filter','event','addevent'].indexOf(props.attributes.widget_type) >=0 ? HIDDEN :  SHOWN 
                    },
                    el(sc,{
                        label: i18n.__('COM_CONNECTDAILY_SHOW_BY',CDaily.CAPTION_BUNDLE),
                        value: props.attributes.by_method,
                        id: 'cd-list-events-by',
                        options: getByOptions(),
                        onChange: function(value){ setAttributes({by_method: value});}
                    }),
                    el(sc,{
                        id: 'cd-list-events-by_id',
                        value: props.attributes.by_id,
                        label: i18n.__('COM_CONNECTDAILY_SHOW_FOR',CDaily.CAPTION_BUNDLE),
                        options: getByIds(props.attributes.by_method),
                        onChange: function( value ){ setAttributes({by_id: value}); }
                    })
                ),
                /*
                    Responsive Full Sized Settings
                 
                    Wrap Event Titles
                    Enable Select Calendar Dropdown
                    Enable Event Styles
                */
                el(
                    'fieldset',
                    {id: "cd-rcalendar-settings",
                        style: props.attributes.widget_type=='monthview' ? SHOWN : HIDDEN
                    },
                    el(
                        wp.components.CheckboxControl,
                        {
                            id: 'cd-rcalendar-wrap', 
                            checked: props.attributes.wrap_events,
                            label: i18n.__('COM_CONNECTDAILY_WRAPTITLES',CDaily.CAPTION_BUNDLE),
                            onChange: function( value ){ setAttributes({wrap_events: value});}
                        }
                    ),
                    el(
                        wp.components.CheckboxControl,
                        {
                            id: 'cd-enable-dropdown', 
                            checked: props.attributes.enable_dropdown,
                            label: i18n.__('COM_CONNECTDAILY_ENABLE_SELECTDD',CDaily.CAPTION_BUNDLE),
                            onChange: function(value){ setAttributes({enable_dropdown: value}); }
                        }
                    ),
                    el(
                        wp.components.CheckboxControl,
                        {
                            id: 'cd-rcalendar-enablestyles', 
                            checked: props.attributes.enable_styles,
                            label: i18n.__('COM_CONNECTDAILY_ENABLE_STYLES',CDaily.CAPTION_BUNDLE),
                            onChange: function(value){ setAttributes({ enable_styles: value}); }
                        }
                    ),
                    el(
                        wp.components.CheckboxControl,
                        {
                            id: 'cd-rcalendar-show-add-button', 
                            checked: props.attributes.show_add_button,
                            label: i18n.__('Show create event button',CDaily.CAPTION_BUNDLE),
                            onChange: function(value) { setAttributes({ show_add_button: value }); }
                        }
                    )

                ),
                /*
                    List Events Settings
                 
                    Max # Events
                    Max # Days In Future
                 
                    Show Recurring Events Only Once
                    Show Start Times
                    Show End Time
                */
                el(
                    'fieldset',
                    {id: 'cd-event-list-settings',
                        style: ['detailedlist','simplelist'].indexOf(props.attributes.widget_type) >=0 ? SHOWN : HIDDEN
                    },
                    el(
                        wp.components.TextControl,
                        {
                            type: 'number',
                            value: props.attributes.maxcount,
                            label: i18n.__('COM_CONNECTDAILY_MAX_EVENTS',CDaily.CAPTION_BUNDLE),
                            min: 1,
                            onChange: function(value){ setAttributes({maxcount: value});}
                        }
                    ),
                    el(
                        wp.components.TextControl,
                        {
                            type: 'number',
                            value: props.attributes.dayspan,
                            label: i18n.__('COM_CONNECTDAILY_MAX_DAYS',CDaily.CAPTION_BUNDLE),
                            min: 1,
                            onChange: function(value){ setAttributes({dayspan: value}); }
                        }
                    ),
                    el(
                        wp.components.CheckboxControl,
                        {
                            checked: props.attributes.allow_duplicates,
                            label: i18n.__('COM_CONNECTDAILY_SHOW_ONCE',CDaily.CAPTION_BUNDLE), 
                            onChange: function( value ){ setAttributes({allow_duplicates: (value ? true : false)}); }
                        }
                    ),
                    el(
                        wp.components.CheckboxControl,
                        {
                            checked: props.attributes.show_starttimes, 
                            label: i18n.__('COM_CONNECTDAILY_SHOWSTART',CDaily.CAPTION_BUNDLE),
                            onChange: function( value ) { setAttributes({show_starttimes: value}); }
                        }
                    ),
                    el(
                        wp.components.CheckboxControl,
                        {
                            checked: props.attributes.show_endtimes, 
                            label: i18n.__('COM_CONNECTDAILY_SHOWEND',CDaily.CAPTION_BUNDLE),
                            onChange: function(value){ setAttributes({show_endtimes: value}); } 
                        }
                    )
                ),
                /*
                    Events Filter for Calendar
                 
                    Filter Events By
                        Event Type
                    Title
                    Collapse Threshold
                    Collapse Label
                    Expand Label
                */
                el(
                    'fieldset',
                    {id: 'cd-filter-options',
                        style: props.attributes.widget_type=='filter' ? SHOWN : HIDDEN
                    },
                    el(
                        sc,
                        {                   
                            value: props.attributes.by_method,
                            label: i18n.__('COM_CONNECTDAILY_FilterBy', CDaily.CAPTION_BUNDLE),
                            options: getByOptions(),
                            onChange: function( value ){ setAttributes({ by_method: value });}
                        }
                    ),
                    el(
                        wp.components.TextControl,
                        {
                            type: 'string',
                            placeholder: 'Enter a title',
                            label: i18n.__('COM_CONNECTDAILY_Title', CDaily.CAPTION_BUNDLE),
                            value: props.attributes.title,
                            onChange: function(value){ setAttributes({title: value}); }
                        }
                    ),
                    el(
                        wp.components.TextControl,
                        {
                            type: 'number',
                            value: props.attributes.collapse_threshold,
                            label: i18n.__('COM_CONNECTDAILY_CollapseThreshold',CDaily.CAPTION_BUNDLE),
                            min: 1,
                            onChange: function(value) { setAttributes({collapse_threshold: value}); }
                        }
                    ),
                    el(
                        wp.components.TextControl,
                        {
                            type: 'string',
                            placeholder: 'collapse label',
                            label: i18n.__('COM_CONNECTDAILY_CollapseLabel', CDaily.CAPTION_BUNDLE),
                            value: props.attributes.collapse_label,
                            onChange: function(value){setAttributes({collapse_label: value}); }
                        }
                    ),
                    el(
                        wp.components.TextControl,
                        {
                            type: 'string',
                            placeholder: 'expand label',
                            label: i18n.__('COM_CONNECTDAILY_ExpandLabel', CDaily.CAPTION_BUNDLE),
                            value: props.attributes.expand_label,
                            onChange: function(value){ setAttributes({expand_label: value}); }
                        }
                    ),
                    el(
                        wp.components.TextareaControl,
                        { 
                            label: i18n.__('Instructions'),
                            value: props.attributes.content,
                            placeholder: i18n.__('COM_CONNECTDAILY_EventFilterInstructionsPlaceHolder', CDaily.CAPTION_BUNDLE),
                            onChange: function( value ){ setAttributes({content: value}); }
                        }
                    )
                ),
                /*
                    Event ID
                 
                    Single Event From
                */
                el(
                    'fieldset',
                    {
                        id: 'cd-single-event',
                        style: props.attributes.widget_type=='event' ? SHOWN : HIDDEN
                    },
                    el(
                        wp.components.TextControl,
                        {
                            type: 'number',
                            value: props.attributes.cal_item_id,
                            label: i18n.__('COM_CONNECTDAILY_EventID',CDaily.CAPTION_BUNDLE),
                            min: 1,
                            onChange: function(value){ setAttributes({cal_item_id: value, 'by_id': value,'by_method': 'cal_item_id','maxcount' : 1}); }
                        }
                    )
                ),
                /*
                    Add Event Form
                 
                    Allow creating Recurring Events
                */
                el(
                        'fieldset',
                        {'id': 'cd-add-options',
                            style: props.attributes.widget_type=='addevent' ? SHOWN : HIDDEN
                        },
                        el(
                            wp.components.CheckboxControl,
                            {
                                checked: props.attributes.allow_recurrence, 
                                label: i18n.__('COM_CONNECTDAILY_AllowRecurrence',CDaily.CAPTION_BUNDLE),
                                onChange: function(value){ setAttributes({allow_recurrence: value}); }
                            }
                        )
                ),
                /*
                    iCalendar Link
                */
                el(
                    'fieldset',
                    {'id': 'cd-icalendar-content',
                        style: props.attributes.widget_type=='icalendar' ? SHOWN : HIDDEN
                    },
                    el(
                        wp.components.TextareaControl,
                        { 
                            label: i18n.__('Link Content'),
                            value: props.attributes.content,
                            placeholder: i18n.__('Link content - Leave blank for default icon.', CDaily.CAPTION_BUNDLE),
                            onChange: function( value ){ setAttributes({content: value}); }
                        }
                    )
                ),
                /*
                    IFrame Size
                 
                    Height: 1024px
                    width: 100%
                */
                el(
                        'fieldset',
                        {'id': 'cd-iframe-settings',
                            style: props.attributes.widget_type=='iframe' ? SHOWN : HIDDEN

                        },
                        el(sc,{
                            type: 'string',
                            id: 'cd-iframe-view',
                            label: i18n.__('COM_CONNECTDAILY_CALENDAR_FORMAT', CDaily.CAPTION_BUNDLE),
                            value: props.attributes.iframe_target,
                            onChange: function(value) { setAttributes({ iframe_target: value }) },
                            options: [
                                { value: "View.html", label: i18n.__("COM_CONNECTDAILY_DefaultCalendarView", CDaily.CAPTION_BUNDLE)},
                                { value: "ViewCal.html", label: i18n.__("COM_CONNECTDAILY_MonthView", CDaily.CAPTION_BUNDLE)},
                                { value: "ViewWeek.html", label: i18n.__("COM_CONNECTDAILY_WeekView", CDaily.CAPTION_BUNDLE)},
                                { value: "ViewDay.html", label: i18n.__("COM_CONNECTDAILY_DayView", CDaily.CAPTION_BUNDLE)},
                                { value: "ViewYear.html", label: i18n.__("COM_CONNECTDAILY_YearView", CDaily.CAPTION_BUNDLE)},
                                { value: "ViewList.html", label: i18n.__("COM_CONNECTDAILY_ListView", CDaily.CAPTION_BUNDLE)}
                            ]
                        }),
                        el(
                            wp.components.TextControl,
                            {
                                label: i18n.__('COM_CONNECTDAILY_Height',CDaily.CAPTION_BUNDLE),
                                value: props.attributes.height,
                                onChange: function(value) { setAttributes({height: value}); }
                            }
                        ),
                        el(
                            wp.components.TextControl,
                            {
                                label: i18n.__('COM_CONNECTDAILY_Width',CDaily.CAPTION_BUNDLE),
                                value: props.attributes.width,
                                onChange: function(value) { setAttributes({width: value});}
                            }
                        )
                    ),
                el(
                    wp.components.TextControl,
                    {
                        type: 'string',
                        placeholder: 'Additional Options - See Manual',
                        label: i18n.__('COM_CONNECTDAILY_UncatOptions', CDaily.CAPTION_BUNDLE),
                        value: props.attributes.other_options,
                        onChange: function(value){ setAttributes({other_options: value}); }
                    }
                )

                )];
    },
    save: function() {
        // Rendering in PHP
        return null;
    },
});

