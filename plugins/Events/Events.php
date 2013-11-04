<?php
/**
 * Piwik - Open source web analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 *
 * @category Piwik_Plugins
 * @package Events
 */
namespace Piwik\Plugins\Events;

use Piwik\Piwik;
use Piwik\Plugin;

/**
 * @package Events
 */
class Events extends Plugin
{
    /**
     * @see Piwik\Plugin::getListHooksRegistered
     */
    public function getListHooksRegistered()
    {
        return array(
            'API.getSegmentsMetadata'         => 'getSegmentsMetadata',
        );
    }

    public function getSegmentsMetadata(&$segments)
    {
        $sqlFilter = '\\Piwik\\Tracker\\TableLogAction::getIdActionFromSegment';

        $segments[] = array(
            'type'       => 'dimension',
            'category'   => 'Events_Events',
            'name'       => 'Events_EventCategory',
            'segment'    => 'eventCategory',
            'sqlSegment' => 'log_link_visit_action.idaction_event_category',
            'sqlFilter'  => $sqlFilter,
        );
        $segments[] = array(
            'type'       => 'dimension',
            'category'   => 'Events_Events',
            'name'       => 'Events_EventAction',
            'segment'    => 'eventAction',
            'sqlSegment' => 'log_link_visit_action.idaction_event_action',
            'sqlFilter'  => $sqlFilter,
        );
        $segments[] = array(
            'type'       => 'dimension',
            'category'   => 'Events_Events',
            'name'       => 'Events_EventName',
            'segment'    => 'eventName',
            'sqlSegment' => 'log_link_visit_action.idaction_name',
            'sqlFilter'  => $sqlFilter,
        );
        $segments[] = array(
            'type'       => 'metric',
            'category'   => 'Events_Events',
            'name'       => 'Events_EventValue',
            'segment'    => 'eventValue',
            'sqlSegment' => 'log_link_visit_action.custom_float'
        );
        $segments[] = array(
            'type'           => 'metric',
            'category'       => Piwik::translate('General_Visit'),
            'name'           => 'Events_NbEvents',
            'segment'        => 'events',
            'sqlSegment'     => 'log_visit.visit_total_events',
            'acceptedValues' => 'To select all visits who triggered an Event, use: &segment=events>0',
        );
    }
}
