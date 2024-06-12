using Unity.Collections;
using UnityEngine;
using UnityEngine.EventSystems;

public class RiskCard : MonoBehaviour, IPointerClickHandler
{
    public int scope;
    public int quality;
    public int time;
    public int money;
    public bool mitigated = false;
    public int difficulty;
    public void Mitigate()
    {
        mitigated = true;
    }
    public void Deletion()
    {
        Destroy(gameObject);
    }
    public void OnPointerClick(PointerEventData eventData)
    {
        Mitigate();
    }
}
