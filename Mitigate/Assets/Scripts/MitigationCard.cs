using System.Collections;
using System.Collections.Generic;
using UnityEditor.EditorTools;
using UnityEngine;
using UnityEngine.EventSystems;

public class MitigationCard : MonoBehaviour
{
    public int scope;
    public int quality;
    public int time;
    public int money;
    public bool selected = false;
    public void Deletion()
    {
        Destroy(gameObject);
    }
    public void OnPointerClick(PointerEventData eventData)
    {
        SelectCard();
    }
    public void SelectCard()
    {
        selected = true;
    }
}